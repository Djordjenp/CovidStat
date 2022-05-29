import styles from './ContinentBarChartContainer.module.css'
import TheBarChart from "../Graphs/TheBarChart/TheBarChart";

const ContinentBarChartContainer = ({continent, data, totalInfected}) => {

    const capitalizeContinent = continent[0].toUpperCase() + continent.slice(1);

    return (
        <div className={styles.continent__graph}>
            <h3 className={styles.continent__graph__header}>{capitalizeContinent}</h3>
            <p className={styles.continent__graph__infected}>{totalInfected}</p>
            <TheBarChart data={data} color={`var(--${continent.toLowerCase().replace('_', '-')}-color)`}/>
        </div>
    )
}

export default ContinentBarChartContainer;