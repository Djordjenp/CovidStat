import styles from './MapTooltip.module.css'
import React, {useEffect, useRef} from "react";
import {numberWithCommas} from "../../helpers/utils";

const MapTooltip = React.forwardRef(({country, infected, deaths, x, y, recovered}, ref) => {


    return (
        <div ref={ref} className={styles.tooltip} style={{left: `${x}px`, top: `${y}px`}}>
            <h1 className={styles.tooltip__title}>{country}</h1>
            <p className={styles.tooltip__info}> {infected ? numberWithCommas(infected) : infected} Infected</p>
            <p className={styles.tooltip__info}>{deaths ? numberWithCommas(deaths) : deaths} Deaths</p>
            <p className={styles.tooltip__info}>{recovered ? numberWithCommas(recovered) : recovered} Recovered</p>
        </div>
    )
})

export default MapTooltip;