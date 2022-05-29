import styles from './ContinentLegend.module.css'
import {formatter} from "../../helpers/utils";



const ContinentLegend = ({continent, continentCases, continentWithMostCases, onMouseOver, onMouseOut}) => {

    const styleClass = `bar__fill--${continent}`
    const barWidth = {width: `${100 * continentCases / continentWithMostCases}%`}

    const continentCapitalizeName = continent[0].toUpperCase() + continent.slice(1)
    const formattedNumberOfCases = formatter.format(continentCases)


    const mouseOverHandler = () => {
        onMouseOver(continent)
    }

    const mouseOutHandler = () => {
        onMouseOut(continent)
    }

    return (
        <div className={`${styles['continent__data']}`}>
            <div className={styles["continent__data__info"]}>
                <h4>{continentCapitalizeName}</h4>
                <p>{formattedNumberOfCases} Infected</p>
            </div>
            <div onMouseOver={mouseOverHandler} onMouseOut={mouseOutHandler} style={barWidth} className={`${styles['bar__fill']} ${styles[styleClass]}`} />
        </div>
    )
}

export default ContinentLegend;