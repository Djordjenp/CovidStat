import styles from './ContinentsPieChartContainer.module.css'
import React from "react";
import {formatContinentName, numberWithCommas} from "../../helpers/utils";

const PieChartTooltip = ({continent, data, position, size}) => {

    const positionArray = position.split(',')

    const borderValue = `2px solid var(--${continent}-color-dark)`

    const positionTooltip = {
        left: `calc(50% + ${positionArray[0]}px)`,
        top: `calc(50% + ${positionArray[1]}px)`
    }

    return (
        <div className={`${styles.piechart__tooltip} `} style={{border: borderValue, ...positionTooltip}}>
            <h4>{formatContinentName(continent)}</h4>
            <p>{numberWithCommas(data)}</p>
        </div>
    )
}

export default PieChartTooltip;