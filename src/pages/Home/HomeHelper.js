import {checkResponse, getResponseJson, sendGetRequest} from "../../helpers/asyncTasks";

const sendRequestForGlobal = sendGetRequest('https://disease.sh/v3/covid-19/all')

export const getGlobalData = () =>
    sendRequestForGlobal
        .chain(checkResponse)
        .chain(getResponseJson)


