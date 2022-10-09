import create from 'zustand'
import {Either, IO} from "monio";
import {chain, map, pipe} from "ramda";
import {checkResponse, getResponseJson, sendGetRequest} from "../helpers/asyncTasks";
import * as topojson from "topojson-client";


function convertToGeoJson(data, property) {
    return topojson.feature(data, data.objects[property])
}

const fetchGeoJson = pipe(
    sendGetRequest,
    chain(checkResponse),
    chain(getResponseJson),
)

function* main() {
    try {
        const returnVal = yield fetchGeoJson("https://unpkg.com/world-atlas@2.0.2/countries-50m.json")
        return Either.Right(returnVal)
    }catch (err){
        return Either.Left(err)
    }
}

const useGeoJsonStore = create(set => ({
    geoJsonData: null,
    loading: false,
    error: null,
    geoJsonMap: null,
    fetch: async () => {
        set(() => ({loading: true}));
        const result = await IO.do(main).run()
        result.fold(
            error => {
                set(() => ({error: error, loading: false}))
            },

            data => {
                const geoJsonMap = new Map()
                let geoJsonArr = convertToGeoJson(data, 'countries')
                geoJsonArr.features.filter(feature => feature.properties.name !== 'Ashmore and Cartier Is.').forEach(geometry => {
                    geoJsonMap.set(+geometry.id, geometry)
                })
                set(() => ({geoJsonData: geoJsonArr, geoJsonMap: geoJsonMap, loading: false}))
            }
        )
    }
}))

export default useGeoJsonStore;