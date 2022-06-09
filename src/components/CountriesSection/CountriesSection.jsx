import styles from './CountriesSection.module.css'
import useAsyncIO from "../../hooks/useAsyncIO";
import {byCriteriaDes, getCountriesData, isNotEmpty, whereEquals} from "./CountriesSectionHelper";
import {
    __,
    and,
    append,
    concat,
    cond,
    equals,
    isEmpty,
    isNil,
    length,
    lensProp,
    not,
    over,
    set,
    sort,
    when
} from "ramda";
import Loading from "../Loading/Loading";
import CountryCard from "../CountryCard/CountryCard";
import {useInfinityScrollObserver} from "../../hooks/useInfinityScrollObserver";
import {useEffect, useReducer, useRef, useState} from "react";
import {isEmptyString, isNotNil, notEmpty, notEmptyString, notEqual, notNil, whenIs} from "../../helpers/utils";

const countriesLens = lensProp('countriesDisplayed')
const countriesDataLens = lensProp('countriesData')
const searchingLens = lensProp('isSearching')
const loadingLens = lensProp('loading')

const activeSortStyle = {
    backgroundColor: `var(--clr-green)`,
    color: '#fff'
}

const countryToCountryCard = country => <CountryCard
    key={country.countryInfo._id || country.country}
    country={country.country}
    flag={country.countryInfo.flag}
    continent={country.continent}
    infected={country.cases}
    recovered={country.recovered}
    deaths={country.deaths}/>


const countriesReducer = (state, {type, val}) => {
    return cond([
        [equals("SET_DISPLAYED_COUNTRIES"), () => set(countriesLens, val, state)],
        [equals("SET_DATA"), () => set(countriesDataLens, val, state)],
        [equals("SET_LOADING"), () => set(loadingLens, val, state)],
        [equals("SET_IS_SEARCHING"), () => set(searchingLens, val, state)],
        [equals("RESET_COUNTRIES"), () => ({
            countriesDisplayed: [],
            sortMethod: val,
            countriesData: sort(byCriteriaDes(val), state.countriesData),
            loading: false,
            isSearching: state.isSearching
        })],
        [equals("DISPLAY_MORE_COUNTRIES"), () => {
            return over(countriesLens, concat(__, state.countriesData.slice(state.countriesDisplayed.length, state.countriesDisplayed.length + 20).map(countryToCountryCard)), state)
        }]
    ])(type)

    // whereEquals([
    //     ["SET_DISPLAYED_COUNTRIES", set(countriesLens, val, state)],
    //     ["SET_DATA", set(countriesDataLens, val, state)],
    //     ["SET_LOADING", set(loadingLens, val, state)],
    //     ["SET_IS_SEARCHING", set(searchingLens, val, state)],
    //     ["RESET_COUNTRIES", ({
    //                 countriesDisplayed: [],
    //                 sortMethod: val,
    //                 countriesData: sort(byCriteriaDes(val), state.countriesData),
    //                 loading: false,
    //                 isSearching: state.isSearching
    //             })],
    //     ["DISPLAY_MORE_COUNTRIES", over(countriesLens, concat(__, state.countriesData.slice(state.countriesDisplayed.length, state.countriesDisplayed.length + 20).map(countryToCountryCard)), state)]
    // ])(type)
}

const CountriesSection = ({searchedCountry, sectionCoordinatesFn}) => {

    let [countries, dispatchFn] = useReducer(countriesReducer, {
        countriesDisplayed: [],
        sortMethod: 'cases',
        countriesData: [],
        loading: true,
        isSearching: false
    })
    let [error, setError] = useState(null)

    const refForLazyLoading = useRef(null);
    const sectionRef = useRef(null)
    const isRefVisible = useInfinityScrollObserver(refForLazyLoading)

    // When is mounted send Get Request
    const data = useAsyncIO({
        sideEffectFunction: getCountriesData
    })

    // Used for smooth scrolling on search
    useEffect(() => {
        whenIs(sectionRef)(notNil)(() => {
            sectionCoordinatesFn(sectionRef.current.getBoundingClientRect().top + window.scrollY)
        })
    }, [])


    // Used when user searches for country
    useEffect(() => {
        whenIs(searchedCountry)(notEmptyString)(() => {
            dispatchFn({type: "SET_IS_SEARCHING", val: true})
            const countryUserSearched = countries.countriesData.filter(country => {
                return country.country.toLowerCase().includes(searchedCountry.toLowerCase())
            })

            if (countryUserSearched) {
                dispatchFn({type: "SET_DISPLAYED_COUNTRIES", val: countryUserSearched.map(countryToCountryCard)})
            }
        })

        if (searchedCountry === '') {
            dispatchFn({type: "SET_IS_SEARCHING", val: false})
            dispatchFn({type: "SET_DISPLAYED_COUNTRIES", val: []})
            dispatchFn({type: "DISPLAY_MORE_COUNTRIES"})
        }

    }, [searchedCountry])

    //used when data is fetched from server
    useEffect(() => {
        whenIs(data)(notNil)(() => {
            data.fold(
                    x => setError(x),
                    countriesArr => dispatchFn({type: "SET_DATA", val: countriesArr})
                )})
    }, [data])


    //used when countries data set
    useEffect(() => {
        whenIs(countries.countriesData)(notEmpty) (() => {
            dispatchFn({type: "SET_LOADING", val: false})
            dispatchFn({type: "DISPLAY_MORE_COUNTRIES"})
        })
    }, [countries.countriesData])


    //used when user scrolls to end of section
    useEffect(() => {                                // when we change sort method              when we don't search for country        when we reach end of countries
        const shouldDisplayMoreCountries = isRefVisible && isNotEmpty(countries.countriesDisplayed) && countries.isSearching === false  && countries.countriesDisplayed.length < countries.countriesData.length
        if (shouldDisplayMoreCountries){
            dispatchFn({type: 'DISPLAY_MORE_COUNTRIES'})
        }
    }, [isRefVisible])


    const sortCountriesBy = criteria => (e) => {
        e.preventDefault();
        whenIs(criteria, notEqual(countries.sortMethod))(() => dispatchFn({type: "RESET_COUNTRIES", val: criteria}))
    }


    return (
        <section ref={sectionRef} className={styles['section-countries']}>
            <div className={styles.countries__sort}>
                <a style={countries.sortMethod === 'cases' ? activeSortStyle : null} href="#"
                   onClick={sortCountriesBy('cases')} className={styles.countries__sort__option}>By Cases</a>
                <a style={countries.sortMethod === 'deaths' ? activeSortStyle : null} href="#"
                   onClick={sortCountriesBy('deaths')} className={styles.countries__sort__option}>By Deaths</a>
                <a style={countries.sortMethod === 'recovered' ? activeSortStyle : null} href="#"
                   onClick={sortCountriesBy('recovered')} className={styles.countries__sort__option}>By Recovered</a>
                <a style={countries.sortMethod === 'country' ? activeSortStyle : null} href="#" onClick={sortCountriesBy('country')}
                   className={styles.countries__sort__option}>By Name</a>
            </div>

            {countries.loading ?
                <div className="flex-row  flex-center margin-top-md">
                    <Loading/>
                </div>
                :
                <div className={styles.countries__grid}>
                    {error ? <p>Oops Something Went Wrong</p> : isEmpty(countries.countriesDisplayed) ? <p className={styles.countries__not__found}>No Country Found</p> : countries.countriesDisplayed}
                </div>
            }

            <div ref={refForLazyLoading}/>
        </section>
    )

}

export default CountriesSection;

