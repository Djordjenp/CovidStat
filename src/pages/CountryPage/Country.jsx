import React, {useEffect} from "react";
import styles from './Country.module.css'
import WorldMap from "../../components/WorldMap/WorldMap";
import {Outlet, useParams} from "react-router-dom";
import useCountriesStore from "../../store/store";



const Country = ({setStickyNav}) => {

    const countriesData = useCountriesStore(state => state.countriesMapData)
    const fetchCountries = useCountriesStore(state => state.fetch)
    let { countryName } = useParams();



    useEffect(() => {
        setStickyNav(true)
    }, [])


    // If no countries' data in state then fetch them
    useEffect(() => {
        if(countriesData) return;
        fetchCountries()
    }, [countriesData])




    return (
        <section className={styles['section-countries']}>
            <WorldMap />
            <Outlet />
        </section>
    )
}




export default React.memo(Country);