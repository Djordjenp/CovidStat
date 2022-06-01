import styles from './CountriesSection.module.css'
import useAsyncIO from "../../hooks/useAsyncIO";
import {getCountriesData, isNotEmpty} from "./CountriesSectionHelper";
import {__, and, append, concat, cond, equals, isEmpty, isNil, lensProp, not, over, set, when} from "ramda";
import Loading from "../Loading/Loading";
import CountryCard from "../CountryCard/CountryCard";
import {useInfinityScrollObserver} from "../../hooks/useInfinityScrollObserver";
import {useEffect, useReducer, useRef, useState} from "react";
import {isNotNil, notEqual, whenIs} from "../../helpers/utils";

const countriesLens = lensProp('countriesDisplayed')
const countriesDataLens = lensProp('countriesData')
const numOfCountriesLens = lensProp('numOfCountries')
const sortMethodLens = lensProp('sortMethod')
const loadingLens = lensProp('loading')


const activeSortStyle = {
    backgroundColor: `var(--clr-green)`,
    color: '#fff'
}

const countriesReducer = (state, {type, val}) => {
    return cond([
        [equals("SET_COUNTRIES"), () => over(countriesLens, concat(__,val), state)],
        [equals("SET_COUNTRIES_NUM"), () => set(numOfCountriesLens, val, state)],
        [equals("SET_SORT_METHOD"), () => set(sortMethodLens, val, state)],
        [equals("SET_DATA"), () => set(countriesDataLens, val, state)],
        [equals("SET_LOADING"), () => set(loadingLens, val, state)],
        [equals("RESET_COUNTRIES"), () => ({countriesDisplayed: [], numOfCountries: 0, sortMethod: val, countriesData: null, loading: true})]
    ]) (type)
}

const CountriesSection = () => {

    let [countries, dispatchFn] = useReducer(countriesReducer, {countriesDisplayed: [], numOfCountries: 0, sortMethod: 'cases', countriesData: null, loading: true})
    let [error, setError] = useState(null)

    const ref = useRef(null);
    const isRefVisible = useInfinityScrollObserver(ref)

    // When Sort Method changes send GET REQUEST
    const data = useAsyncIO({sideEffectFunction: getCountriesData, args: [countries.sortMethod]}, [countries.sortMethod])

    useEffect(() => {
        if (data){
            data.fold(x => setError(x), countriesArr => {
                dispatchFn({type: "SET_DATA", val: countriesArr})
                dispatchFn({type: "SET_LOADING", val: false})
            })
        }
    }, [data])


    useEffect(() => {
        // if (countries.countriesData){
        //     const countriesToLoad =
        //         countries.countriesData.slice(countries.numOfCountries, countries.numOfCountries + 20)
        //             .map(country => {
        //                 return <CountryCard
        //                     key={country.countryInfo._id || country.country}
        //                     country={country.country}
        //                     flag={country.countryInfo.flag}
        //                     continent={country.continent}
        //                     infected={country.cases}
        //                     recovered={country.recovered}
        //                     deaths={country.deaths}
        //                 />})
        //
        //     dispatchFn({type: "SET_COUNTRIES", val: countriesToLoad})
        // }

        whenIs(countries.countriesData)(isNotNil) (() => {
            const countriesToLoad = countries.countriesData.slice(countries.numOfCountries, countries.numOfCountries + 20)
                        .map(country => {
                            return <CountryCard
                                key={country.countryInfo._id || country.country}
                                country={country.country}
                                flag={country.countryInfo.flag}
                                continent={country.continent}
                                infected={country.cases}
                                recovered={country.recovered}
                                deaths={country.deaths}
                            />})

                dispatchFn({type: "SET_COUNTRIES", val: countriesToLoad})
        })

        
    }, [countries.countriesData, countries.numOfCountries])

    useEffect(() => {
        const shouldDisplayMoreCountries = and(isRefVisible, isNotEmpty(countries.countriesDisplayed))
        shouldDisplayMoreCountries && dispatchFn({type: 'SET_COUNTRIES_NUM', val: countries.numOfCountries + 20})
    }, [isRefVisible])


    const sortCountriesBy = criteria => (e) => {
        e.preventDefault();
        // if (notEqual(criteria, countries.sortMethod)){
        //     dispatchFn({type: "RESET_COUNTRIES", val: criteria})
        // }
        whenIs(criteria,notEqual(countries.sortMethod)) (() => dispatchFn({type: "RESET_COUNTRIES", val: criteria}))

    }


    return (
        <section className={styles['section-countries']}>
            <div className={styles.countries__sort}>
                <a style={countries.sortMethod === 'cases' ? activeSortStyle : null} href="#" onClick={sortCountriesBy('cases')}  className={styles.countries__sort__option}>By Cases</a>
                <a style={countries.sortMethod === 'deaths' ? activeSortStyle : null} href="#" onClick={sortCountriesBy('deaths')} className={styles.countries__sort__option}>By Deaths</a>
                <a style={countries.sortMethod === 'recovered' ? activeSortStyle : null} href="#" onClick={sortCountriesBy('recovered')} className={styles.countries__sort__option}>By Recovered</a>
                <a style={countries.sortMethod === '' ? activeSortStyle : null} href="#" onClick={sortCountriesBy('')} className={styles.countries__sort__option}>By Name</a>
            </div>

            {countries.loading ?
                <Loading />
                    :
                <div className={styles.countries__grid}>
                    {error ? <p>Ooops Something Went Wrong</p> : countries.countriesDisplayed}
                </div>
            }

            <div ref={ref} />
        </section>
    )

}

export default CountriesSection;

