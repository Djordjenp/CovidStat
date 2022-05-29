import styles from './TheBarChart.module.css'
import * as d3 from 'd3'
import XAxis from "./XAxis";
import YAxis from "./YAxis";
import {useRef, useState} from "react";
import {numberWithCommas} from "../../../helpers/utils";
import Tooltip from "../../Tooltip/Tooltip";


const TheBarChart = ({data, color}) => {

    let [highlighted, setHighlighted] = useState(false)
    let [selectedData, setSelectedData] = useState({index: null, date: '', infected: 0})
    let [positions, setPositions] = useState({
        startingXPosition: undefined,
        width: undefined,
        middleOfBarXPosition: undefined
    })


    const barRefs = useRef([])
    const svgRef = useRef(null)

    const mouseOverHandler = (index, date, infected) => () => {
        setHighlighted(true);
        setSelectedData({index, date, infected})
        setPositions({
            startingXPosition: svgRef.current.getBoundingClientRect().x,
            width: svgRef.current.getBoundingClientRect().width,
            middleOfBarXPosition: barRefs.current[index].getBoundingClientRect()?.x + barRefs.current[index].getBoundingClientRect()?.width / 2
        })
    }

    const mouseOutHandler = () => {
        setHighlighted(false)
        setSelectedData({index: null, date: '', infected: 0})
    }


    const width = 620
    const height = 280
    const margin = {top: 20, bottom: 25, left: 20, right: 50}

    const graphWidth = width - margin.left - margin.right
    const graphHeight = height - margin.top - margin.bottom

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, data => +data.infected)])
        .range([graphHeight, 0])

    const yAxisPosition = y.ticks().map(value => ({value, offSet: y(value)}))

    const x = d3.scaleBand()
        .domain(data.map(item => item.date))
        .range([0, graphWidth])
        .paddingInner(0.1)

    return (
        <div className={styles.canvas}>
            <svg ref={svgRef} className={styles.svg} viewBox={`0 0 ${width} ${height}`}
                 preserveAspectRatio={'xMinYMin'}>
                <g width={graphWidth} height={graphHeight} transform={`translate(${margin.left}, ${margin.top})`}>
                    {data.map((d, i) =>
                        <g key={d.date} className={"rect-container"}>
                            <rect width={x.bandwidth() + x.bandwidth() * .1} height={graphHeight} x={x(d.date)} y={0}
                                  fill={'none'} pointerEvents={"all"}
                                  onMouseOver={mouseOverHandler(i, d.date, d.infected)} onMouseOut={mouseOutHandler}/>
                            <rect ref={el => barRefs.current[i] = el} width={x.bandwidth()} data-date={d.date}
                                  data-infected={d.infected} height={graphHeight - y(d.infected)}
                                  fill={!highlighted ? color : i === selectedData.index ? color : `var(--clr-gray)`}
                                  x={x(d.date)} y={y(d.infected)} rx={8} ry={8} pointerEvents={'none'}/>
                        </g>
                    )}


                    <XAxis data={data} step={x.step()} widthOfBar={x.bandwidth()} xPosition={graphHeight}/>
                    <YAxis ticks={yAxisPosition} yPosition={graphWidth + x.bandwidth() / 2}/>
                </g>
            </svg>


            <Tooltip highlighted={highlighted} date={selectedData.date}
                     infected={numberWithCommas(selectedData.infected)} parentX={positions.startingXPosition}
                     parentWidth={positions.width} color={color} position={positions.middleOfBarXPosition}/>

        </div>
    )
}

export default TheBarChart;