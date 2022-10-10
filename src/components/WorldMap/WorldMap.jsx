import styles from './WorldMap.module.css'
import * as d3 from "d3";
import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import Paths from "./Paths";
import useCountriesStore from "../../store/store";
import {addAttributeIO, addStyleIO} from "../../helpers/utils";
import {IO} from "monio";
import MapTooltip from "./MapTooltip";
import useGeoJsonStore from "../../store/geoJsonStore";
import {useNavigate, useParams} from "react-router-dom";
import Legend from "./Legend";
import Loading from "../Loading/Loading";


const legend = {
    ">5 000 000" : '#c92a2a',
    "1 000 000 - 5 000 000" : '#e03131',
    "500 000 - 1 000 000" : '#f03e3e',
    "100 000 - 500 000" : '#fa5252',
    "50 000 - 100 000": '#ff6b6b',
    "10 000 - 50 000": '#ff8787',
    "5 000 - 10 000": '#ffa8a8',
    "<5 000": '#ffc9c9'
}


let projection = d3.geoMercator()
    .center([0, 60])

let path = d3.geoPath(projection);

const colorScale = d3.scaleThreshold()
    .domain([5000, 10_000, 50_000, 100_000, 500_000, 1_000_000, 5_000_000])
    .range(['#ffc9c9', '#ffa8a8', '#ff8787', '#ff6b6b', '#fa5252', '#f03e3e', '#e03131', '#c92a2a']);

const width = 960
const height = 710

const WorldMap = () => {


    const navigate = useNavigate()
    const countriesData = useCountriesStore(state => state.countriesMapData)
    const countriesNameMapData = useCountriesStore(state => state.countriesNameMapData)
    const mapGeoJson = useGeoJsonStore(state => state.geoJsonData)
    const mapGeoJsonMap = useGeoJsonStore(state => state.geoJsonMap)
    const fetchGeoJson = useGeoJsonStore(state => state.fetch)
    const tooltipRef = useRef(null)
    const svgRef = useRef(null)
    const circleRef = useRef(null)
    const groupRef = useRef(null)
    const [selectedCountryId, setSelectedCountryID] = useState(null)
    let { countryName } = useParams();


    // Define zoom object
    const zoom =  d3.zoom()
        .scaleExtent([1, 20])
        .translateExtent([[0, 0], [width, height]])
        .on('zoom', zoomed)

    useEffect(() => {
        if (!countryName || !mapGeoJsonMap || !countriesNameMapData) return


        // clickHandler(mapGeoJsonMap.get(countriesNameMapData.get(countryName).countryInfo._id))()

        const bounds = path.bounds(mapGeoJsonMap.get(countriesNameMapData.get(countryName).countryInfo._id))
        const dx = bounds[1][0] - bounds[0][0]
        const dy = bounds[1][1] - bounds[0][1]
        const x = (bounds[0][0] + bounds[1][0]) / 2
        const y = (bounds[0][1] + bounds[1][1]) / 2
        const scale = Math.max(1, Math.min(20, 0.9 / Math.max(dx / width, dy / height)))
        const translate = [width / 2 - scale * x, height / 2 - scale * y];

        d3.select(svgRef.current).transition().duration(650)
            .call(zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );

    }, [countryName, mapGeoJsonMap, svgRef.current, countriesNameMapData])


    // Get GeoJSON data
    useEffect(() => {
        if (mapGeoJson) return
        fetchGeoJson();
    }, [])




    useEffect(() => {
        if (!svgRef.current) return;
        d3.select(svgRef.current).call(zoom);
    })



    // When user pans or uses zoom
    function zoomed(event) {
        groupRef.current.setAttribute('transform', event.transform)
        const circleRect = circleRef.current.getBoundingClientRect()
        const svgRect = svgRef.current.getBoundingClientRect()
        setTooltipPosition(circleRect, svgRect).run()
    }

    const sendSelectedCountry = useMemo(() => {
        if (!countriesNameMapData) return
        return countriesNameMapData.get(countryName).countryInfo._id
    }, [countriesNameMapData])


    const handleMouseOver = useCallback((feature) => (e) => {
        const country = countriesData?.get(+feature.id)
        if (!country){
            const coordinates = path.centroid(feature);
            setCirclePosition(coordinates[0], coordinates[1]).run()

            const svgRect = svgRef.current.getBoundingClientRect()
            const circleRect = circleRef.current.getBoundingClientRect()

            setSelectedCountryID('none')
            setTooltipPosition(circleRect, svgRect).run()

            return;
        }

        const lat = country?.countryInfo?.lat;
        const long = country?.countryInfo?.long;

        setCirclePosition(projection([long,lat])[0], projection([long,lat])[1]).run()

        setSelectedCountryID(+feature.id)
    }, [countriesData])

    const setCirclePosition = (cx, cy) => IO.do(function *(){
        yield addAttributeIO(['cx', `${cx}px`], circleRef.current)
        yield addAttributeIO(['cy', `${cy}px`], circleRef.current)
    })

    const setTooltipPosition = (circleRect, svgRect) => IO.do(function *() {
        if (selectedCountryId === 'none' || !tooltipRef.current) return;
        yield addStyleIO(['left', `${circleRect.left + (circleRect.width / 2)}px`], tooltipRef.current)
        yield addStyleIO(['top', `${(circleRect.top + circleRect.height / 2) - svgRect.top}px`], tooltipRef.current)
    })

    const clickHandler = useCallback((feature) => () => {
        navigate(`/country/${countriesData.get(+feature.id).country}`)
    }, [countriesNameMapData])


    const fillHandler = useCallback( (feature) => {
        return colorScale(countriesData?.get(+feature.id)?.cases || 0)
    }, [countriesData])

    const mouseLeaveHandler = useCallback(feature => {
        setSelectedCountryID(null)
    }, [])

    return (
        <div className={styles.wrapper}>

            {mapGeoJson ?   <><svg className={styles.svg__map} ref={svgRef} viewBox={`0 0 ${width} ${height}`} >
                    <g ref={groupRef} >
                        {mapGeoJson ? <Paths selectedCountry={sendSelectedCountry} path={path} features={mapGeoJson} fillHandler={fillHandler} clickHandler={clickHandler} mouseOverHandler={handleMouseOver} mouseLeaveHandler={mouseLeaveHandler} /> : null}
                        <circle ref={circleRef} r={.5} fill={'none'} pointerEvents={'none'} />
                    </g>
                </svg>

                { selectedCountryId && <MapTooltip ref={tooltipRef} country={countriesData?.get(selectedCountryId)?.country || `No Country Data`}
                                                   deaths={countriesData?.get(selectedCountryId)?.deaths}
                                                   infected={countriesData?.get(selectedCountryId)?.cases} recovered={countriesData?.get(selectedCountryId)?.recovered}
                                                   x={circleRef.current.getBoundingClientRect().x + (circleRef.current.getBoundingClientRect().width / 2) }
                                                   y={(circleRef.current.getBoundingClientRect().y + circleRef.current.getBoundingClientRect().height /2) - svgRef.current.getBoundingClientRect().top}/>}


                <Legend data={Object.entries(legend)}/>
                </> :

                <div className={"loader__wrapper margin-top-md"}>
                    <Loading />
                </div>
            }

        </div>
    )
}

export default React.memo(WorldMap);


