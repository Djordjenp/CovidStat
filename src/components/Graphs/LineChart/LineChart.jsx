import styles from "./LineChart.css";
import * as d3 from "d3";
import {useEffect, useRef} from "react";
import {formatter, numberWithCommas} from "../../../helpers/utils";



const width = 620
const height = 280
const margin = {top: 20, bottom: 25, left: 20, right: 50}
const graphWidth = width - margin.left - margin.right
const graphHeight = height - margin.top - margin.bottom


const bisect = d3.bisector(function(d) { return new Date(d[0]); }).left;

const formatValue = d3.format(".2s");

const LineChart = ({data, xAxisValues, yAxisValues, color, typeOfChart}) => {

    const groupRef = useRef(null)
    const svgRef = useRef(null)
    const yAxisRef = useRef(null)
    const xAxisRef = useRef(null)
    const circleRef = useRef(null)
    const textRef = useRef(null)
    const lineRef = useRef(null)
    const gridRef = useRef(null)





    const x = d3.scaleTime()
        .domain(d3.extent(xAxisValues.map(key => new Date(key))))
        .range([0, graphWidth])


    const y = d3.scaleLinear()
        .domain([0, d3.max(yAxisValues)])
        .range([graphHeight, 0])


    const yAxisPosition = y.ticks().map(value => ({value, offSet: y(value)}))

    function make_y_gridlines() {
        return d3.axisLeft(y)
            .ticks(5)
    }

    const createGraph = async () => {
        d3.select(lineRef.current)
            .datum(data)
            .attr('fill', 'none')
            .attr("stroke", color)
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return x(new Date(d[0])) })
                .y(function(d) { return y(d[1]) })
            )
    }

    const createXAxis = async () => {
        d3.select(xAxisRef.current)
            .call(d3.axisBottom(x))
            .call(g => g.select(".domain")
                .remove())
            .call(g => g.selectAll("line")
                .remove())
    }

    const createYAxis = async () => {
        d3.select(yAxisRef.current)
            .call(d3.axisRight(y).tickFormat(function(d) { return formatter.format(+d)}).ticks(5))
            .call(g => g.select(".domain")
                .remove())
            .call(g => g.selectAll('line')
                .remove())
    }

    const createGrid = async () => {
        d3.select(gridRef.current)
            .call(make_y_gridlines()
            .tickSize(-graphWidth)
            .tickFormat(""))
    }

    const mouseOverHandler = () => {
        d3.select(circleRef.current).attr("opacity", 1)
        d3.select(textRef.current).attr("opacity", 1)
    }

    const mousemove = (event) => {
        // recover coordinate we need
        const x0 = x.invert(d3.pointer(event)[0]);
        const i = bisect(data, x0, 1);
        const selectedData = data[i]

        if (selectedData){
            d3.select(circleRef.current)
                .attr("cx", x(new Date(selectedData[0])))
                .attr("cy", y(selectedData[1]) + margin.top)

            d3.select(textRef.current)
                .html(new Date(selectedData[0]).toLocaleDateString('en-US') + "  -  " + (selectedData[1] !== 0 ? numberWithCommas(selectedData[1]) + " " + typeOfChart : "No Data"))
                .attr("x", width / 2  )
                .attr('text-anchor', 'middle')
                .attr("y", 0)
        }else {
            d3.select(circleRef.current).attr("opacity", 0) // When user hovers over y axis, circle doesn't appear
        }

    }

    const touchmove = (event) => {
        // recover coordinate we need
        const x0 = x.invert(d3.pointers(event)[0][0]);
        const i = bisect(data, x0, 1);
        const selectedData = data[i]

        if (selectedData){
            d3.select(circleRef.current)
                .attr("cx", x(new Date(selectedData[0])))
                .attr("cy", y(selectedData[1]) + margin.top)

            d3.select(textRef.current)
                .html(new Date(selectedData[0]).toLocaleDateString('en-US') + "  -  " + (selectedData[1] !== 0 ? numberWithCommas(selectedData[1]) + " " + typeOfChart : "No Data"))
                .attr("x", width / 2  )
                .attr('text-anchor', 'middle')
                .attr("y", 0)
        }else {
            d3.select(circleRef.current).attr("opacity", 0) // When user hovers over y axis, circle doesn't appear
        }

    }

    const mouseOutHandler = () => {
        d3.select(circleRef.current).attr("opacity", 0)
        d3.select(textRef.current).attr("opacity", 0)
    }

    useEffect(() => {
        createXAxis()
        createYAxis()
        createGraph()
        createGrid();

    }, [data])






    return (
        <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} style={{overflow: "visible"}} onMouseOver={mouseOverHandler}  onTouchMove={touchmove} onMouseMove={mousemove}  onMouseOut={mouseOutHandler} preserveAspectRatio={'xMinYMin'} >



            <g ref={groupRef} width={graphWidth} height={graphHeight} transform={`translate(0, ${margin.top})`}>
                <g className={"grid__chart"} ref={gridRef} >

                </g>
                <g id={"yAxis"} className={styles.yAxis} ref={yAxisRef} transform={`translate(${graphWidth}, 0)`} textAnchor={"start"}></g>
                <g id={"xAxis"} className={styles.xAxis} ref={xAxisRef} transform={`translate(0, ${graphHeight})`} textAnchor={"middle"}></g>
                <g id={"lineChart"} >
                    <path ref={lineRef} />
                </g>

            </g>

            <g>
              <circle ref={circleRef} r={8.5} opacity={0} fill={"none"} stroke={color} />
            </g>

            <g id={'linechart__text__info'}>
                <text ref={textRef} fontWeight={"bold"} fill={color} opacity={0} alignmentBaseline={"middle"} textAnchor={"left"}></text>
            </g>

        </svg>
    )
}

export default LineChart