import styles from './DataInfo.module.css'
import {useEffect, useLayoutEffect, useRef} from "react";
import {numberWithCommas} from "../../helpers/utils";
import {useIntersectionObserver} from "../../hooks/useIntersectionObserver";
import {useIntersectionOnce} from "../../hooks/useIntersectionOnce";

const DataInfo = ({title, data}) => {

    const spanRef = useRef(null)
    const isFigureVis = useIntersectionOnce(spanRef, {threshold: 0.5})

    useLayoutEffect(() => {
        if (!isFigureVis) return

        let timeoutFn;

        const updateCounter = () => {
            const target = spanRef.current.getAttribute('data-target');
            const counterValue = +spanRef.current.innerText;
            const increment = target / 150;

            if (counterValue < target){
                spanRef.current.innerText = Math.ceil(counterValue + increment)
                 timeoutFn = setTimeout(updateCounter, 1)
            }else {
                spanRef.current.innerText = numberWithCommas(Math.ceil(counterValue + increment))
            }
        }

        updateCounter()

        return () => {
            spanRef.current.innerText = '0'
            clearTimeout(timeoutFn)
        }


    }, [isFigureVis])

    return (
        <figure className={styles.data__wrapper}>
            <h2>{title}</h2>
            <span ref={spanRef} data-target={data}>0</span>
        </figure>
    )
}

export default DataInfo;