import styles from './ThePieChart.module.css'
import * as d3 from "d3"
import React, {useEffect, useRef} from "react";
import useResizeObserver from "../../../hooks/useResizeObserver";
import PieChartTooltip from "../../ContinentsPieChartContainer/PieChartTooltip";



const ThePieChart = ({continentsData, hoveredArc, handleMouseOver, handleMouseLeave}) =>  {


    const wrapperRef = useRef()

    const size = useResizeObserver(wrapperRef, [
        { small: 500 },
    ])


    const arcsRef = useRef([])
    const selectedArcRef = hoveredArc ? arcsRef.current.find(arc => arc.getAttribute('id') === hoveredArc.id) : null;

    let width = 600
    let height = 600
    let margin = 20

    let radius = Math.min(width, height) / 2 - margin;

    const pie = d3.pie().value(function(d) {
        return d.cases;
    })(continentsData);


    const arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(0);

    return (
        <div ref={wrapperRef} className={styles.canvas}>
            <svg className={styles.svg} viewBox={`0 0 ${width} ${height}`} overflow={'visible'} preserveAspectRatio={"xMinYMin"}>
                <g transform={`translate(${width / 2}, ${height / 2})`}>
                    {pie.map( (x, i) => {
                        return <path onMouseLeave={handleMouseLeave} onMouseOver={handleMouseOver(x.data.continent)} d={arc(x)} ref={el => arcsRef.current[i] = el} data-centroid={arc.centroid(x)} data-cases={x.data.cases} key={x.data.continent}  id={`${x.data.continent}`} fill={!hoveredArc ? `var(--${x.data.continent}-color)` : hoveredArc.id === x.data.continent ? `var(--${x.data.continent}-color)` : `var(--clr-gray)`} stroke={!hoveredArc ? null : hoveredArc?.id === x.data.continent ?  null : '#9a9a9a' } transform={hoveredArc?.id === x.data.continent ? `scale(1.1)` : null} data-selected={hoveredArc?.id === x.data.continent ? 'true' : 'false'} data-color={`var(--${x.data.continent}-color)`} className={styles['piechart__path']} />
                    })}
                </g>
            </svg>

            {hoveredArc ? <PieChartTooltip continent={hoveredArc.id} data={selectedArcRef.dataset.cases} position={size ? '0,0' : selectedArcRef.dataset.centroid} /> : null}

        </div>
    )
}

export default  ThePieChart;

//
// const ThePieChart = ({continentsData, onMouseOver, onMouseOut}, ref) =>  {
//
//     const wrapperRef = useRef()
//
//     const size = useResizeObserver(wrapperRef, [
//         { small: 500 },
//     ])
//
//
//     const {pieSlicesRefs, tooltipRef, tooltipTitleRef, tooltipCasesRef} = ref.current;
//
//     let width = 600
//     let height = 600
//     let margin = 20
//
//     let radius = Math.min(width, height) / 2 - margin;
//
//     const pie = d3.pie().value(function(d) {
//         return d.cases;
//     })(continentsData);
//
//
//     const arc = d3.arc()
//         .outerRadius(radius)
//         .innerRadius(0);
//
//
//     return (
//             <div ref={wrapperRef} className={styles.canvas}>
//                 <svg className={styles.svg} viewBox={`0 0 ${width} ${height}`} overflow={'visible'} preserveAspectRatio={"xMinYMin"}>
//                     <g transform={`translate(${width / 2}, ${height / 2})`}>
//                         {pie.map( (x, i) => {
//                             return <path d={arc(x)} ref={el => pieSlicesRefs.current[i] = el} data-size={size} data-centroid={arc.centroid(x)} data-cases={x.data.cases} key={x.data.continent}  onMouseOver={() => onMouseOver(x.data.continent.toLowerCase().split(' ').join('-'))} onMouseOut={() => onMouseOut(x.data.continent)} id={`${x.data.continent}`} fill={`var(--${x.data.continent}-color)`} data-color={`var(--${x.data.continent}-color)`} className={styles['piechart__path']} />
//                         })}
//                     </g>
//                 </svg>
//
//                 <div ref={tooltipRef} className={`${styles.piechart__tooltip} hidden`}>
//                     <h4 ref={tooltipTitleRef}>North America</h4>
//                     <p ref={tooltipCasesRef}>5K Infected</p>
//                 </div>
//             </div>
//     )
// }
//
// export default  React.forwardRef( ThePieChart);