import {checkResponse, getResponseJson, parallelRequest, sendGetRequest} from "../../helpers/asyncTasks";
import {IO} from 'monio'
import {waitAll} from "monio/io/helpers";
import {always, cond, equals, isEmpty, not} from "ramda";


export const byCriteriaDes = criteria => (a, b) => {
    return a[criteria] < b[criteria] ? 1 :
        a[criteria] > b[criteria] ? -1 : 0
}

export const byCriteriaAsc = criteria => (a, b) => {
    return a[criteria] > b[criteria] ? 1 :
        a[criteria] < b[criteria] ? -1 : 0
}

export const whereEquals = arr => val => {
   return cond(arr.map(condition => [equals(condition[0]), always(condition[1])])) (val)
}



export const getCountriesData = ()  =>
    sendGetRequest(`https://disease.sh/v3/covid-19/countries?sort=cases&allowNull=allowNull`)
        .chain(checkResponse)
        .chain(getResponseJson)



export const isNotEmpty = arr => not(isEmpty(arr))

