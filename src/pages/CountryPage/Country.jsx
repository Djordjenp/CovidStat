import {useEffect} from "react";
import styles from './Country.module.css'
import WorldMap from "../../components/WorldMap/WorldMap";

const Country = ({setStickyNav}) => {



    useEffect(() => {
        setStickyNav(true)
    }, [])

    const position = [51.505, -0.09]


    return (
        <section className={styles['section-countries']}>
            <WorldMap />

            <div className={styles.country__details}>
                <img className={styles['country__details__image']} src="https://www.segwaybeograd.rs/wp-content/uploads/2022/04/russian-flag-russian-flag-russia-flag-of-russia.jpg" alt="Country Flag"/>
                <h2 className={styles['country__details__name']}>Russia</h2>
            </div>
        </section>
    )
}

export default Country;