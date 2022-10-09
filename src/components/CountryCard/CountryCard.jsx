import styles from './CountryCard.module.css'
import {pipe} from "ramda";
import {prepProps} from "./CountryCardHelper";
import { useNavigate } from "react-router-dom";
import {Flipped} from "react-flip-toolkit";

const CountryCard = ({country, flag, continent, infected, recovered, deaths}) => {

    const navigate = useNavigate()

    function goCountryPage() {
        navigate(`/country/${country}`)

    }

    return   (
        <figure onClick={goCountryPage} className={styles.country}>

            <header className={styles.country__header}>
                <Flipped flipId={'flag'}>
                    <img className={styles.country__img} src={flag} alt="Country Flag"/>
                </Flipped>
                <Flipped flipId={'country_name'}>
                    <h4 className={styles.country__name}>{country}</h4>
                </Flipped>
                <span className={styles.country__continent}>{continent}</span>
            </header>

            <div className={styles.country__data}>
                <div className={styles.country__data__infected}>
                    <p>Infected</p>
                    <p>{infected}</p>
                </div>
                <div className={styles.country__data__recovered}>
                    <p>Recovered</p>
                    <p>{recovered}</p>
                </div>
                <div className={styles.country__data__deaths}>
                    <p>Deaths</p>
                    <p>{deaths}</p>
                </div>
            </div>

        </figure>
    )
}


export default pipe(prepProps, CountryCard);