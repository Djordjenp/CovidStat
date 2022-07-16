import styles from './WorldMap.module.css'
import * as d3 from "d3";
import {useEffect, useRef, useState} from "react";
import useCountriesStore from "../../store/store";
import * as topojson from "topojson-client";
import {e} from "../../../dist/assets/vendor.70cedccf";
import {path} from "ramda";

const WorldMap = () => {

    const countriesData = useCountriesStore(state => state.countriesMapData)
    const fetchCountries = useCountriesStore(state => state.fetch)
    const svgRef = useRef(null)
    const pathRefs = useRef([])
    let [mapJson, setMapJson] = useState(null)
    let [mapTopo, setMapTopo] = useState(null)


    useEffect(() => {
        if(countriesData) return;
        fetchCountries()
    }, [countriesData])

    useEffect(() => {
        d3.json("https://unpkg.com/world-atlas@2.0.2/countries-50m.json").then(data => setMapTopo(data))
    }, [])

    useEffect(() => {
        if (!mapTopo) return;
        setMapJson(topojson.feature(mapTopo, mapTopo.objects.countries))
    }, [mapTopo])

    useEffect(() => {
        if (!svgRef.current) return;
        d3.select(svgRef.current).call(zoom);
    }, [svgRef.current])

    const projection = d3.geoMercator()
        .center([0, 60])

    const colorScale = d3.scaleThreshold()
        .domain([5000, 10_000, 50_000, 100_000, 500_000, 1_000_000, 5_000_000])
        .range(['#ffc9c9', '#ffa8a8', '#ff8787', '#ff6b6b', '#fa5252', '#f03e3e', '#e03131', '#c92a2a']);

    function zoomed(event) {
        pathRefs.current.forEach(path => {
            path.setAttribute('transform', event.transform)
        })
    }

    const zoom = d3.zoom()
        .scaleExtent([1, 12])
        .translateExtent([[0, 0], [960,650]])
        .on('zoom', zoomed);


    const handleMouseOver = (feature) => (e) => {
        console.log(e)
    }

    return (
        <svg className={styles.svg__map} ref={svgRef} viewBox={'0 0 900 400'}>
            <g>
                {mapJson?.features?.map((feature, i) => <path onMouseOver={handleMouseOver(feature)} className={styles.svg__country} ref={el => pathRefs.current[i] = el} fill={colorScale(countriesData?.get(+feature.id)?.cases || 0)} key={i}  d={d3.geoPath().projection(projection)(feature)} />)}
            </g>
        </svg>
    )
}

export default WorldMap;