import {checkResponse, getResponseJson, parallelRequest, sendGetRequest} from "../../helpers/asyncTasks";
import {IO} from 'monio'
import {waitAll} from "monio/io/helpers";
import {isEmpty, not} from "ramda";


export const getCountriesData = sortBy  =>
    sendGetRequest(`https://disease.sh/v3/covid-19/countries?sort=${sortBy}&allowNull=allowNull`)
        .chain(checkResponse)
        .chain(getResponseJson)



export const isNotEmpty = arr => not(isEmpty(arr))

