import styles from './ContinentLegend.module.css'
import {formatContinentName, formatter} from "../../helpers/utils";
import {join, map, pipe, split} from "ramda";




const ContinentLegend = ({continent, continentCases, continentWithMostCases, handleMouseLeave, handleMouseOver}) => {

    const styleClass = `bar__fill--${continent}`
    const barWidth = {width: `${100 * continentCases / continentWithMostCases}%`}

    const continentCapitalizeName = formatContinentName(continent)
    const formattedNumberOfCases = formatter.format(continentCases)




    return (
        <div className={`${styles['continent__data']}`}  >
            <div className={styles["continent__data__info"]}>
                <h4 onMouseOver={handleMouseOver(continent)} onMouseLeave={handleMouseLeave} >{continentCapitalizeName}</h4>
                <p>{formattedNumberOfCases} Infected</p>
            </div>
            <div onMouseOver={handleMouseOver(continent)} onMouseLeave={handleMouseLeave} style={barWidth} className={`${styles['bar__fill']} ${styles[styleClass]}`} />
        </div>
    )
}

export default ContinentLegend;

// const ContinentLegend = ({continent, continentCases, continentWithMostCases, onMouseOver, onMouseOut}) => {
//
//     const styleClass = `bar__fill--${continent}`
//     const barWidth = {width: `${100 * continentCases / continentWithMostCases}%`}
//
//     const continentCapitalizeName = formatContinentName(continent)
//     const formattedNumberOfCases = formatter.format(continentCases)
//
//
//     const mouseOverHandler = () => {
//         onMouseOver(continent)
//     }
//
//     const mouseOutHandler = () => {
//         onMouseOut(continent)
//     }
//
//     return (
//         <div className={`${styles['continent__data']}`}>
//             <div className={styles["continent__data__info"]}>
//                 <h4>{continentCapitalizeName}</h4>
//                 <p>{formattedNumberOfCases} Infected</p>
//             </div>
//             <div onMouseOver={mouseOverHandler} onMouseOut={mouseOutHandler} style={barWidth} className={`${styles['bar__fill']} ${styles[styleClass]}`} />
//         </div>
//     )
// }
//
// export default ContinentLegend;