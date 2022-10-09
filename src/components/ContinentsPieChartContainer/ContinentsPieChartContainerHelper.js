import {checkResponse, getResponseJson, sendGetRequest} from "../../helpers/asyncTasks";
import {IO} from 'monio'
import {
    addAttributeIO,
    addStyleIO,
    addTextContentIO, formatContinentName,
    notEqual,
    numberWithCommas,
    removeAttributeIO
} from "../../helpers/utils";

const sendRequestForContinents = sendGetRequest('https://disease.sh/v3/covid-19/continents')


export const getContinentsData = () =>
    sendRequestForContinents
        .chain(checkResponse)
        .chain(getResponseJson)
        .map(data => data.reduce((obj, continent) => {
            obj.continentWithMaxCases = (continent.cases > obj.continentWithMaxCases)  ? continent.cases : obj.continentWithMaxCases
            obj.list.push({continent: continent.continent.toLowerCase().split(' ').join('-'), cases: continent.cases})
            return obj
        }, {continentWithMaxCases: 0, list: []}))



export const highlightArcIO = (continent, slices) =>
    IO.do(function* () {
        for (let slice of slices) {
            if (notEqual(slice.id, continent)){
                yield addAttributeIO(['fill', '#757575'], slice)
                yield addAttributeIO(['stroke', '#9a9a9a'], slice)
            }else {
                yield addAttributeIO(['transform', 'scale(1.1)'], slice)
            }
        }
    })



export const resetArcsIO = (continent, slices) =>
    IO.do(function*() {
        for (let slice of slices) {
            if (notEqual(slice.id, continent)){
                yield addAttributeIO(['fill', `${slice.dataset.color}`], slice)
                yield removeAttributeIO('stroke', slice)
            }else {
                yield removeAttributeIO('transform', slice)
            }
        }
    })



export const positionTooltip = (arc, tooltip) => IO.do(function* () {
    if (arc.dataset.size){
        yield addStyleIO(['left', `50%`], tooltip);
        yield addStyleIO(['top', `50%`], tooltip);
    }else {
        const centroid = arc.dataset.centroid.split(',')
        yield addStyleIO(['left', `calc(50% + ${centroid[0] }px)`], tooltip);
        yield addStyleIO(['top', `calc(50% + ${centroid[1] }px)`], tooltip);
    }

    yield addStyleIO(['transform', 'translate(-50%, -50%)'], tooltip);
    yield addStyleIO(['border', `2px solid var(--${arc.id.toLowerCase().split(' ').join('-')}-color-dark)`], tooltip)
})

export const setTooltipContent = (arc, tooltipTitle, tooltipCases) => IO.do(function* () {
    const cases = arc.dataset.cases;
    const continent = arc.id


    yield addTextContentIO(`${formatContinentName(continent)}`, tooltipTitle)
    yield addTextContentIO(numberWithCommas(cases), tooltipCases)
})

