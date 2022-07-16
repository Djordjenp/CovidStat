import styles from './ContinentsSection.module.css'
import ContinentsPieChartContainer from "../ContinentsPieChartContainer/ContinentsPieChartContainer";
import csv from '../../assets/SixContinentFirst.csv'
import ContinentBarChartContainer from "../ContinentBarChartContainer/ContinentBarChartContainer";
import {numberWithCommas} from "../../helpers/utils";
import React from "react";


const data = csv.reduce((prev,next) => {
    prev.africa.push({date: next.Dates, infected: next.Africa})
    prev.europe.push({date: next.Dates, infected: next.Europe})
    prev.asia.push({date: next.Dates, infected: next.Asia})
    prev.north_america.push({date: next.Dates, infected: next['North America']})
    prev.south_america.push({date: next.Dates, infected: next['South America']})
    prev.australia_oceania.push({date: next.Dates, infected: next.Oceania})



    return prev;
}, {africa: [], europe: [], asia: [], north_america: [], south_america: [], australia_oceania: []})


const africaTotal = data.africa.reduce((prevVal, nextVal) => prevVal + (+nextVal.infected),0)
const europeTotal = data.europe.reduce((prevVal, nextVal) => prevVal + (+nextVal.infected),0)
const asiaTotal = data.asia.reduce((prevVal, nextVal) => prevVal + (+nextVal.infected),0)
const north_america_Total = data.south_america.reduce((prevVal, nextVal) => prevVal + (+nextVal.infected),0)
const south_america_Total = data.north_america.reduce((prevVal, nextVal) => prevVal + (+nextVal.infected),0)
const australia_oceania_Total = data.australia_oceania.reduce((prevVal, nextVal) => prevVal + (+nextVal.infected),0)


const total = {
    africa: africaTotal,
    asia: asiaTotal,
    north_america: north_america_Total,
    south_america: south_america_Total,
    europe: europeTotal,
    australia_oceania: australia_oceania_Total
}

const ContinentsSection = () => {

    return (
        <section className={styles['section-continental']}>
            <ContinentsPieChartContainer />
            {Object.keys(data).map(cont => <ContinentBarChartContainer key={cont} continent={cont}  data={data[cont]} totalInfected={numberWithCommas(total[cont])} />)}
        </section>
    )

}

export default React.memo(ContinentsSection);