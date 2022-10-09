import styles from "./Tooltip.module.css"
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {__, add, always, cond, gt, lt, pipe, subtract, T} from "ramda";

const Tooltip = ({parentWidth, parentX,color, position, date,infected, highlighted }) => {

    const [positions, setPositions] = useState({arrowAndBorderPosition: null, tooltipPosition: null})
    const tooltipRef = useRef(null)

    useLayoutEffect(() => {
            const tooltipWidth = tooltipRef.current.getBoundingClientRect().width

            const arrowAndBorderPos = cond([
                [ pipe(add(tooltipWidth / 2), gt(__, (parentX + parentWidth))), always(`calc(50% + ${position - ((parentX + parentWidth - tooltipWidth) + tooltipWidth / 2)}px)`)],
                [ pipe(subtract(__, tooltipWidth / 2), lt(__, parentX)),  always(`calc(50% + ${position - (parentX + tooltipWidth / 2)}px)`)],
                [T, always(`50%`)]
            ])

            const tooltipPosition = cond([
                [pipe(add(tooltipWidth / 2), gt(__, parentX + parentWidth)), always(`translateX(${parentWidth - tooltipWidth}px)`)],
                [pipe(subtract(__, tooltipWidth / 2), lt(__, parentX)), always(`translateX(0)`)],
                [T, always(`translateX(calc(${position - parentX}px - 50%))`)]
            ])

            setPositions({arrowAndBorderPosition: arrowAndBorderPos(position), tooltipPosition: tooltipPosition(position)})

    }, [highlighted, position])

    return (
        <div  style={{borderColor: color, transform: positions.tooltipPosition}} ref={tooltipRef} className={`${styles.tooltip} ${highlighted ? undefined : 'hidden'} `} >
            <div className={styles.tooltip__arrow}  style={{borderBottomColor: color, left: positions.arrowAndBorderPosition}} />
            <div className={styles.tooltip__border} style={{left: positions.arrowAndBorderPosition}}/>
            <h4 className={styles.tooltip__title}>Date: {date}</h4>
            <p className={styles.tooltip__info}>{infected} Infected</p>
        </div>
    )
}

export default Tooltip;