import useAsyncIO from "../../hooks/useAsyncIO";
import {
    getContinentsData,
    highlightArcIO,
    positionTooltip,
    resetArcsIO, setTooltipContent
} from "./ContinentsPieChartContainerHelper";
import ContinentLegend from "../ContinentLegend/ContinentLegend";
import styles from './ContinentsPieChartContainer.module.css'
import {isNil} from "ramda";
import Loading from "../Loading/Loading";
import ThePieChart from "../Graphs/ThePieChart/ThePieChart";
import {useRef, useState} from "react";
import {addClassIO, removeClassIO} from "../../helpers/utils";


const ContinentsPieChartContainer = () => {

    const pieSlicesRefs = useRef([])    //REFS OF PIE SLICES FROM PIE-CHART COMPONENT
    const tooltipRef = useRef()    //REF OF PIE CHART TOOLTIP
    const tooltipTitleRef = useRef()
    const tooltipCasesRef = useRef()
    const pieChartRef = useRef({pieSlicesRefs, tooltipRef, tooltipTitleRef, tooltipCasesRef})

    const [continentHoveredId, setContinentHoveredId] = useState(null)

    const handleMouseOver2 = (id) => () => {
        setContinentHoveredId({id})
    }

    const handleMouseLeave = () => {
        setContinentHoveredId(null)
    }


    const data = useAsyncIO({sideEffectFunction: getContinentsData})


    const loaderOrLegend = isNil(data) ?
        <Loading/> :
        data.fold(
            () => <p>Oops, something went wrong :(</p>,
            data => {
                return (
                    <>
                        <div className={styles['continental__legends']}>
                            {data.list.map(x => <ContinentLegend key={x.continent} continent={x.continent}
                                                                 handleMouseOver={handleMouseOver2}
                                                                 handleMouseLeave={handleMouseLeave}
                                                                 continentWithMostCases={data.continentWithMaxCases}
                                                                 continentCases={x.cases}/>)}
                        </div>
                        <ThePieChart continentsData={data.list} hoveredArc={continentHoveredId} handleMouseOver={handleMouseOver2} handleMouseLeave={handleMouseLeave}
                                    />
                    </>
                )
            }
        )


    return (loaderOrLegend)

}

export default ContinentsPieChartContainer;

// const ContinentsPieChartContainer = () => {
//
//     const pieSlicesRefs = useRef([])    //REFS OF PIE SLICES FROM PIE-CHART COMPONENT
//     const tooltipRef = useRef()    //REF OF PIE CHART TOOLTIP
//     const tooltipTitleRef = useRef()
//     const tooltipCasesRef = useRef()
//     const pieChartRef = useRef({pieSlicesRefs, tooltipRef, tooltipTitleRef, tooltipCasesRef})
//
//     const continentHoveredId = useState(null)
//
//
//     const handleMouseOver = (continent) => {
//         //SIDE EFFECT
//         const selectedArc = pieSlicesRefs.current.find(slice => slice.id === continent)
//         highlightArcIO(continent, pieSlicesRefs.current).run()
//         positionTooltip(selectedArc, tooltipRef.current).run()
//         setTooltipContent(selectedArc, tooltipTitleRef.current, tooltipCasesRef.current).run()
//         removeClassIO('hidden', tooltipRef.current).run()
//     }
//
//
//     const handleMouseOut = (continent) => {
//         // SIDE EFFECT
//         resetArcsIO(continent, pieSlicesRefs.current).run()
//         addClassIO('hidden', tooltipRef.current).run()
//     }
//
//     const handleMouseOver2 = () => {
//
//     }
//
//
//
//     const data = useAsyncIO({sideEffectFunction: getContinentsData})
//
//
//     const loaderOrLegend = isNil(data) ?
//         <Loading/> :
//         data.fold(
//             () => <p>Oops, something went wrong :(</p>,
//             data => {
//                 return (
//                     <>
//                         <div className={styles['continental__legends']}>
//                             {data.list.map(x => <ContinentLegend key={x.continent} continent={x.continent}
//                                                             continentWithMostCases={data.continentWithMaxCases}
//                                                             continentCases={x.cases} onMouseOver={handleMouseOver}
//                                                             onMouseOut={handleMouseOut}/>)}
//                         </div>
//                         <ThePieChart continentsData={data.list} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}
//                                      ref={pieChartRef}/>
//                     </>
//                 )
//             }
//         )
//
//
//     return (loaderOrLegend)
//
// }
//
// export default ContinentsPieChartContainer;