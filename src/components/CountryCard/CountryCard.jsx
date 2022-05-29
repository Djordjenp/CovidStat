import styles from './CountryCard.module.css'
import {defaultTo, numberWithCommas} from "../../helpers/utils";

const CountryCard = ({country, flag, continent, infected, recovered, deaths}) => {

    const defaultToNoData = defaultTo("No Data")

    return   (
        <figure className={styles.country}>

            <header className={styles.country__header}>
                <img className={styles.country__img} src={flag} alt="Country Flag"/>
                <h4 className={styles.country__name}>{country}</h4>
                <span className={styles.country__continent}>{continent}</span>
            </header>

            <div className={styles.country__data}>
                <div className={styles.country__data__infected}>
                    <p>Infected</p>
                    <p>{defaultToNoData(numberWithCommas(infected))}</p>
                </div>
                <div className={styles.country__data__recovered}>
                    <p>Recovered</p>
                    <p>{defaultToNoData(numberWithCommas(recovered))}</p>
                </div>
                <div className={styles.country__data__deaths}>
                    <p>Deaths</p>
                    <p>{defaultToNoData(numberWithCommas(deaths))}</p>
                </div>
            </div>

        </figure>
    )
}


export default CountryCard;