import useAsyncIO from "../../hooks/useAsyncIO";
import {
    getContinentsData,
} from "./ContinentsPieChartContainerHelper";
import ContinentLegend from "../ContinentLegend/ContinentLegend";
import styles from './ContinentsPieChartContainer.module.css'
import {isNil} from "ramda";
import Loading from "../Loading/Loading";
import ThePieChart from "../Graphs/ThePieChart/ThePieChart";
import {useEffect, useRef, useState} from "react";
import useLoaderStore from "../../store/pieChartLoaderStore";
import useScrollToCountriesStore from "../../store/scrollStore";


const ContinentsPieChartContainer = () => {

    const setPieChartLoaded = useLoaderStore(state => state.setPieChartLoaded)
    const shouldScrollTo = useScrollToCountriesStore((state) => state.shouldScroll)
    const setShouldScroll = useScrollToCountriesStore((state) => state.setShouldScroll)


    const [continentHoveredId, setContinentHoveredId] = useState(null)

    const handleMouseOver2 = (id) => () => {
        setContinentHoveredId({id})
    }

    const handleMouseLeave = () => {
        setContinentHoveredId(null)
    }

    const data = useAsyncIO({sideEffectFunction: getContinentsData})

    useEffect(() => {
        if (data && shouldScrollTo){
            setPieChartLoaded(true)
        }

        return () => {
            setPieChartLoaded(false)
        }
    }, [data, shouldScrollTo])



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
                        <ThePieChart continentsData={data.list} hoveredArc={continentHoveredId} handleMouseOver={handleMouseOver2} handleMouseLeave={handleMouseLeave}/>
                    </>
                )
            }
        )


    return (loaderOrLegend)

}

export default ContinentsPieChartContainer;
