import {useParams} from "react-router-dom";
import useCountriesStore from "../../store/store";
import styles from './CountryInfo.module.css'
import Card from "../Card/Card";
import useAsyncIO from "../../hooks/useAsyncIO";
import {getAllHistoricalData} from "./CountryInfoHelper";
import {useEffect, useLayoutEffect, useReducer, useState} from "react";
import LineChart from "../Graphs/LineChart/LineChart";
import DataInfo from "../DataInfo/DataInfo";
import Loading from "../Loading/Loading";
import {Flipped} from "react-flip-toolkit";
import {isNil} from "ramda";

const todayDate = new Date().toLocaleDateString('en-US', {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric',})

const yesterdayDate = new Date(Date.now() - 86400000) // that is: 24 * 60 * 60 * 1000
    .toLocaleDateString('en-US', {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',})

const twoDaysBeforeDate = new Date(Date.now() - 86400000 * 2) // that is: 24 * 60 * 60 * 1000
    .toLocaleDateString('en-US', {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',})

const CountryInfo = () => {

    let { countryName } = useParams();

    const countriesData = useCountriesStore(state => state.countriesNameMapData)
    const countryData = countriesData?.get(countryName)

    let [historicalCountryData, setHistoricalCountryData] = useState(null)
    let [error, setError] = useState(null)

    const historicalEither = useAsyncIO({sideEffectFunction: getAllHistoricalData, args: [countryName]}, [countryName])

    useEffect(() => {
        if (!historicalCountryData) return
        setHistoricalCountryData(null)
    }, [countryName])

    useEffect(() => {
        if (!historicalEither) return

        historicalEither.fold(err => setError(err), data => {
            setHistoricalCountryData(data)
        })

    }, [historicalEither])

    useLayoutEffect(() => {
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
    },[])


    const getTodayCases = () => {
        return (historicalCountryData[1].timeline.cases[todayDate] ?  historicalCountryData[1].timeline.cases[todayDate] - historicalCountryData[1].timeline.cases[yesterdayDate] : historicalCountryData[1].timeline.cases[yesterdayDate] - historicalCountryData[1].timeline.cases[twoDaysBeforeDate])
    }

    const getTodayDeaths = () => {
        return (historicalCountryData[1].timeline.deaths[todayDate] ?  historicalCountryData[1].timeline.deaths[todayDate] - historicalCountryData[1].timeline.deaths[yesterdayDate] : historicalCountryData[1].timeline.deaths[yesterdayDate] - historicalCountryData[1].timeline.deaths[twoDaysBeforeDate])
    }


    return (
        <>
            <section className={styles.country__info__section}>
                {  !countryData ? null :
                    <>
                        <div className={`flex-row flex-center margin-top-md ${styles.country__info__header}`}>
                                <h1 className={styles.country__info__header__title}>{countryName}</h1>
                                <img className={styles.country__info__header__flag} src={countryData.countryInfo?.flag} alt="country flag"/>
                        </div>

                        <div className={`flex-col ${styles.country__info__essentials}`}>
                            <Card color={'--clr-red'} cardTitle={`INFECTED IN ${countryName.toUpperCase()}`} type={'cases'} data={countryData.cases} date={countryData.updated}/>
                            <Card color={'--clr-violet'} cardTitle={`DEATHS IN ${countryName.toUpperCase()}`} data={countryData.deaths} date={countryData.updated}/>
                            <Card color={'--clr-green'} cardTitle={`RECOVERED IN ${countryName.toUpperCase()}`} data={countryData.recovered} date={countryData.updated}/>
                        </div>


                    </>}
            </section>

            <section className={styles.country__info__graphs}>
                {historicalCountryData ?
                        <>
                            <div className={styles.country__info__linechart}>
                                <h3 className={styles.linechart__title}>Cases Over Time</h3>
                                <LineChart typeOfChart={"Infected"} color={'var(--clr-violet)'} data={Object.entries(historicalCountryData[1].timeline.cases)} xAxisValues={Object.keys(historicalCountryData[1].timeline.cases)} yAxisValues={Object.values(historicalCountryData[1].timeline.cases)} />
                            </div>

                            <div className={styles.country__info__linechart}>
                                <h3 className={styles.linechart__title}>Deaths Over Time</h3>
                                <LineChart typeOfChart={"Deaths"} color={'var(--clr-red)'} data={Object.entries(historicalCountryData[1].timeline.deaths)} xAxisValues={Object.keys(historicalCountryData[1].timeline.deaths)} yAxisValues={Object.values(historicalCountryData[1].timeline.deaths)} />
                            </div>

                            <div className={styles.country__info__linechart}>
                                <h3 className={styles.linechart__title}>Recovered Over Time</h3>
                                <LineChart typeOfChart={"Recovered"} color={'var(--clr-green)'} data={Object.entries(historicalCountryData[1].timeline.recovered)} xAxisValues={Object.keys(historicalCountryData[1].timeline.recovered)} yAxisValues={Object.values(historicalCountryData[1].timeline.recovered)} />
                            </div>

                            <div className={styles.country__info__linechart}>
                                <h3 className={styles.linechart__title}>Vaccines Distributed Over Time</h3>
                                <LineChart typeOfChart={"Vaccines Distributed"} color={'var(--europe-color-dark)'} data={Object.entries(historicalCountryData[0].timeline)} xAxisValues={Object.keys(historicalCountryData[0].timeline)} yAxisValues={Object.values(historicalCountryData[0].timeline)} />
                            </div>
                        </>
                     : <div className={`flex-row flex-center grid__item__fullwidth margin-top-hg`}>
                        {  error ? <p className={styles.country__info__error} >Country doesn't have any historical data</p> : <Loading />}
                    </div> }
            </section>


            <section className={styles.country__info__extra}>
                {countryData && historicalCountryData?
                    <>
                        <DataInfo title={"Active"} data={countryData.active} />
                        <DataInfo title={"Critical"} data={countryData.critical} />
                        <DataInfo title={"Tests"} data={countryData.tests} />
                        <DataInfo title={"Today Cases"} data={getTodayCases()} />
                        <DataInfo title={"Today Deaths"} data={getTodayDeaths()} />
                        <DataInfo title={"Population"} data={countryData.population} />
                    </>
                    : null
                }



            </section>

        </>

    )
}

export default CountryInfo;