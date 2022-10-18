import styles from './CountriesSection.module.css'
import {byCriteriaAsc, byCriteriaDes, getCountriesData, isNotEmpty, whereEquals} from "./CountriesSectionHelper";
import {__, concat, isEmpty, isNil, lensProp, over, set, sort,} from "ramda";
import Loading from "../Loading/Loading";
import CountryCard from "../CountryCard/CountryCard";
import {useInfinityScrollObserver} from "../../hooks/useInfinityScrollObserver";
import React, {useEffect, useReducer, useRef, useState} from "react";
import {debounce, isEmptyString, notEmpty, notEmptyString, notEqual, notNil, whenIs} from "../../helpers/utils";
import useCountriesStore from "../../store/store";
import {useLocation} from "react-router-dom";
import useScrollToCountriesStore from "../../store/scrollStore";
import useLoaderStore from "../../store/pieChartLoaderStore";


const countriesLens = lensProp('countriesDisplayed')
const countriesDataLens = lensProp('countriesData')
const searchingLens = lensProp('isSearching')
const loadingLens = lensProp('loading')

const countryToCountryCard = country => <CountryCard
    key={country.countryInfo._id || country.country}
    country={country.country}
    flag={country.countryInfo.flag}
    continent={country.continent}
    infected={country.cases}
    recovered={country.recovered}
    deaths={country.deaths} />


const countriesReducer = (state, {type, val}) => {
    return  whereEquals([
        ["SET_DISPLAYED_COUNTRIES", () => set(countriesLens, val, state)],
        ["SET_DATA", () => set(countriesDataLens, val, state)],
        ["SET_LOADING", () => set(loadingLens, val, state)],
        ["SET_IS_SEARCHING",() => set(searchingLens, val, state)],
        ["RESET_COUNTRIES", () => ({
            countriesDisplayed: [],
            sortMethod: val[0],
            countriesData: val[1] === 'ASC' ? sort(byCriteriaAsc(val[0]), state.countriesData) : sort(byCriteriaDes(val[0]), state.countriesData),
            loading: false,
            isSearching: state.isSearching
        })],
        ["DISPLAY_MORE_COUNTRIES", () => over(countriesLens, concat(__, state.countriesData.slice(state.countriesDisplayed.length, state.countriesDisplayed.length + 20).map(countryToCountryCard)), state)]
    ])(type)
}

const CountriesSection = ({searchedCountry}) => {


    const setShouldScroll = useScrollToCountriesStore((state) => state.setShouldScroll)

    const data = useCountriesStore(state => state.countriesArrayData)
    const fetchCountries = useCountriesStore(state => state.fetch)
    const error = useCountriesStore(state => state.hasErrors)

    const pieChartLoaded = useLoaderStore(state => state.pieChartLoaded)



    let [countries, dispatchFn] = useReducer(countriesReducer, {
        countriesDisplayed: [],
        sortMethod: 'cases',
        countriesData: [],
        loading: true,
        isSearching: false
    })


    const refForLazyLoading = useRef(null);
    const sectionRef = useRef(null)
    const isRefVisible = useInfinityScrollObserver(refForLazyLoading)


    // Scroll To Countries Section
    useEffect(() => {
        if (!pieChartLoaded) return
        sectionRef.current.scrollIntoView({behavior: 'smooth'})
        setShouldScroll(false)
    }, [pieChartLoaded])


    // Used when user searches for country
    useEffect(() => {
        if (notEmptyString(searchedCountry)){
            dispatchFn({type: "SET_IS_SEARCHING", val: true})
            const countryUserSearched = countries.countriesData.filter(country => {
                return country.country.toLowerCase().includes(searchedCountry.toLowerCase())
            })


            if (notEmpty(countryUserSearched)){
                dispatchFn({type: "SET_DISPLAYED_COUNTRIES", val: countryUserSearched.map(countryToCountryCard)})
            }
        }


        if (isEmptyString(searchedCountry)) {
            dispatchFn({type: "SET_IS_SEARCHING", val: false})
            dispatchFn({type: "SET_DISPLAYED_COUNTRIES", val: []})
            dispatchFn({type: "DISPLAY_MORE_COUNTRIES"})
        }

    }, [searchedCountry, countries.countriesData])

    //used when data is fetched from server
    useEffect(() => {
        if (!data){
            fetchCountries()
        }else{
            dispatchFn({type: "SET_DATA", val: data})
        }
    }, [data])


    //used when countries data set
    useEffect(() => {
        if (notEmpty(countries.countriesData)) {
            dispatchFn({type: "SET_LOADING", val: false})
            if (isEmptyString(searchedCountry)){
                dispatchFn({type: "DISPLAY_MORE_COUNTRIES"})
            }
        }
    }, [countries.countriesData])


    //used when user scrolls to end of section
    useEffect(() => {                                // when we change sort method              when we don't search for country        when we reach end of countries
        const shouldDisplayMoreCountries = isRefVisible && isNotEmpty(countries.countriesDisplayed) && countries.isSearching === false  && countries.countriesDisplayed.length < countries.countriesData.length
        shouldDisplayMoreCountries && dispatchFn({type: 'DISPLAY_MORE_COUNTRIES'})
    }, [isRefVisible])


    const sortCountriesBy = (e) => {
        e.preventDefault()
        const [sortCriteria, sortOrder] = e.target.value.split("-")
        dispatchFn({type: "RESET_COUNTRIES", val: [sortCriteria, sortOrder]})
    }



    return (
        <section ref={sectionRef} style={{minHeight: error ? "0" : "90vh"}} className={styles['section-countries']} id={'section-countries'}>
            <div className={styles.countries__sort}>
                <div className={styles.countries__sort__header}>
                    <p className={styles.countries__sort__header__title}>Sort By</p>
                    <select className={styles.countries__sort__options} name={"sortMethod"} id={"sortMethod"} onChange={sortCountriesBy}>
                        <option value="cases-DES">Cases</option>
                        <option value="deaths-DES">Deaths</option>
                        <option value="recovered-DES">Recovered</option>
                        <option value="country-DES">Name(Z-A)</option>
                        <option value="country-ASC">Name(A-Z)</option>

                    </select>
                </div>

            </div>

            {countries.loading ?
                <div className="flex-row  flex-center margin-top-md">
                    <Loading/>
                </div>
                :
                <div className={styles.countries__grid}>
                    {error ? <p className={styles.error__msg}>Oops Something Went Wrong ☹️</p> : isEmpty(countries.countriesDisplayed) ? <p className={styles.countries__not__found}>No Country Found</p> : countries.countriesDisplayed}
                </div>
            }

            <div ref={refForLazyLoading}/>
        </section>
    )

}

export default React.memo(CountriesSection);



