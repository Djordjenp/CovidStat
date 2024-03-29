import create from 'zustand'
import {chain, pipe} from "ramda";
import {checkResponse, getResponseJson, sendGetRequest} from "../helpers/asyncTasks";
import {Either, IO} from "monio";

const fetchCountries = pipe(
    sendGetRequest,
    chain(checkResponse),
    chain(getResponseJson),
)

function* main() {
    try {
        const returnVal = yield fetchCountries('https://disease.sh/v3/covid-19/countries?sort=cases')
        return Either.Right(returnVal)
    }catch (err){
        return Either.Left(err)
    }
}



const useCountriesStore = create(set => ({
    countriesMapData : null,
    countriesArrayData: null,
    countriesNameMapData: null,
    loading: false,
    hasErrors: false,
    fetch: async () => {
        set(() => ({loading: true}));
        const result = await IO.do(main).run()
        result.fold(
            error => {
                set(() => ({hasErrors: error, loading: false}))
            },
            data => {
                const idMap = new Map()
                const countryNameMap = new Map()

                for (const country of data) {
                    idMap.set(country.countryInfo._id, country)
                    countryNameMap.set(country.country, country)
                }

                set(() => ({countriesMapData: idMap}))
                set(() => ({countriesNameMapData: countryNameMap}))
                set(() => ({countriesArrayData: data}))
                set(() => ({loading: false}))
            }
        )
    }
}))

export default useCountriesStore;