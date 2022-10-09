import styles from './ContinentsSection.module.css'
import ContinentsPieChartContainer from "../ContinentsPieChartContainer/ContinentsPieChartContainer";
import csv from '../../assets/SixContinentsData.csv'
import ContinentBarChartContainer from "../ContinentBarChartContainer/ContinentBarChartContainer";
import {numberWithCommas} from "../../helpers/utils";
import React from "react";

const data = csv.reduce((prev,next) => {
    prev.africa.push({date: next.Dates, infected: next.Africa})
    prev.europe.push({date: next.Dates, infected: next.Europe})
    prev.asia.push({date: next.Dates, infected: next.Asia})
    prev['north america'].push({date: next.Dates, infected: next['North America']})
    prev['south america'].push({date: next.Dates, infected: next['South America']})
    prev['australia oceania'].push({date: next.Dates, infected: next.Oceania})



    return prev;
}, {africa: [], europe: [], asia: [], 'north america': [], 'south america': [], 'australia oceania': []})


const africaTotal = data.africa.reduce((prevVal, nextVal) => prevVal + (+nextVal.infected),0)
const europeTotal = data.europe.reduce((prevVal, nextVal) => prevVal + (+nextVal.infected),0)
const asiaTotal = data.asia.reduce((prevVal, nextVal) => prevVal + (+nextVal.infected),0)
const north_america_Total = data['south america'].reduce((prevVal, nextVal) => prevVal + (+nextVal.infected),0)
const south_america_Total = data['north america'].reduce((prevVal, nextVal) => prevVal + (+nextVal.infected),0)
const australia_oceania_Total = data['australia oceania'].reduce((prevVal, nextVal) => prevVal + (+nextVal.infected),0)


const total = {
    africa: africaTotal,
    asia: asiaTotal,
    'north america': north_america_Total,
    'south america': south_america_Total,
    europe: europeTotal,
    'australia oceania': australia_oceania_Total
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