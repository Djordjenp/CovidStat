import styles from "./HomeHeader.module.css";
import image from "../../assets/corona.svg";
import Card from "../Card/Card";
import useAsyncIO from "../../hooks/useAsyncIO";
import {isNil} from "ramda";
import Loading from "../Loading/Loading";
import {getGlobalData} from "./HomeHeaderHelper";
import {useIntersectionObserver} from "../../hooks/useIntersectionObserver";
import {useEffect, useRef, useState} from "react";

const HomeHeader = ({setStickyNav}) => {

    const sectionRef = useRef(null)


     let isIntersecting = useIntersectionObserver(sectionRef, {
         root: null,
         threshold: 0,
         rootMargin: "-60px",
     })



    useEffect(() => {
        setStickyNav(isIntersecting)
    }, [isIntersecting])

    const globalDataEither = useAsyncIO({sideEffectFunction: getGlobalData})

    const loaderOrHomeSection = isNil(globalDataEither) ?
        <div className={"loader__wrapper margin-top-md"}>
            <Loading />
        </div> :
        globalDataEither.fold(
            () => <p>Oops something went wrong :(</p>, // IF ERROR DURING FETCH
            x => {
                return (
                <>
                    <h1 className={styles.header__logo}>
                        <span>C</span>
                        <span className={styles.header__logo__container}><img className={styles.header__logo__svg} src={image} alt=""/></span>
                        <span>vidStat</span>
                    </h1>


                    <div className={`flex-col  ${styles.home__card__container}` }>
                        <Card color={'--clr-red'} cardTitle={'GLOBALLY DIED'}  data={x.deaths} date={x.updated}/>
                        <Card color={'--clr-violet'} cardTitle={'GLOBALLY INFECTED'}  data={x.cases} date={x.updated}/>
                        <Card color={'--clr-green'} cardTitle={'GLOBALLY RECOVERED'}  data={x.recovered} date={x.updated}/>
                    </div>
                </>
                )
            }
        )

    return (
        <section ref={sectionRef} className={`container ${styles['section-header']} `}>
            {loaderOrHomeSection}
        </section>
    )
}

export default HomeHeader;