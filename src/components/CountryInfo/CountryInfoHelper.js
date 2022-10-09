import {chain, pipe} from "ramda";
import {
    checkResponse,
    getResponseJson,
    parallelRequest,
    sendGetRequest
} from "../../helpers/asyncTasks";

// const createUrl = country => `https://disease.sh/v3/covid-19/historical/${country}?lastdays=all`
//
// export const getHistoricalData = (country) =>
//     sendGetRequest(createUrl(country))
//         .chain(checkResponse)
//         .chain(getResponseJson)

const createUrl = country => `https://disease.sh/v3/covid-19/historical/${country}?lastdays=all`
const createVaccineUrl = country => `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${country.toLowerCase()}?lastdays=all&fullData=false`

export const getHistoricalData = (country) =>
    sendGetRequest(createUrl(country))
        .chain(checkResponse)
        .chain(getResponseJson)

export const getVaccineData = (country) =>
     sendGetRequest(createVaccineUrl(country))
        .chain(checkResponse)
        .chain(getResponseJson)


export const getAllHistoricalData = (country) => {
  return   parallelRequest([getVaccineData(country), getHistoricalData(country)])
}

