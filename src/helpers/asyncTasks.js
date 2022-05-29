import {IO} from 'monio'


export const sendGetRequest = url => IO(() => fetch(url))

export const checkResponse = response => response.ok? IO.of(response) : IO(() => {throw "Oops something is wrong with response"})

export const getResponseJson = response => IO(() => response.json())

export const parallelRequest = arrayOfPromises => IO(() => Promise.all(arrayOfPromises.map(promise => promise.run())))