import {defaultTo, evolve, pipe} from "ramda";
import {numberWithCommas} from "../../helpers/utils";

const defaultToNoData = x => x === 0 ? 'No Data' : x

const transformInfo = pipe(
    defaultToNoData,
    numberWithCommas,
)

export const prepProps = evolve({
    infected: transformInfo,
    recovered: transformInfo,
    deaths: transformInfo,
})