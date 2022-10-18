import styles from './ContinentBarChartContainer.module.css'
import TheBarChart from "../Graphs/TheBarChart/TheBarChart";
import useResizeObserver from "../../hooks/useResizeObserver";
import { useRef} from "react";


const ContinentBarChartContainer = ({continent, data, totalInfected}) => {




    const capitalizeContinent = continent.split(' ').map(name => name[0].toUpperCase() + name.slice(1, name.length)).join(' ');

    const continentRef = useRef(null)

    const size = useResizeObserver(continentRef, [
        { small: 800 },
    ])



    return (
        <div ref={continentRef} className={styles.continent__graph}>
            <h3 className={styles.continent__graph__header}>{capitalizeContinent}</h3>
            <p className={styles.continent__graph__infected}>{totalInfected}</p>
            <TheBarChart  yAxisValues={data} xAxisValues={data.map(item => item.date)} xBarCategory={'date'} xBarValue={'infected'}  maxYValueFn={data => +data.infected} ticks={size === 'small' ? 5 : 3} data={data} color={`var(--${continent.split(' ').join('-').toLowerCase()}-color)`}/>
        </div>
    )
}

export default ContinentBarChartContainer;