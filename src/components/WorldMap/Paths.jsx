import styles from './WorldMap.module.css'
import React, {useEffect, useRef} from "react";
import {addClassIO, removeClassIO} from "../../helpers/utils";

const Paths = ({selectedCountry, features, mouseOverHandler, mouseLeaveHandler, clickHandler, fillHandler, path}) => {


    //navigating and changing color of svg path
    const selectedCountryClick = useRef(null);
    const clicked = (feature) => (e) => {
        clickHandler(feature)() // zoom passed from parent component
        if (selectedCountryClick.current) {
            removeClassIO('selected', selectedCountryClick.current).run()
        }
        selectedCountryClick.current = e.target
        addClassIO('selected', e.target).run()
    }


    // Used for initial rendering
    useEffect(() => {
        if (!selectedCountryClick.current) return
        addClassIO('selected', selectedCountryClick.current).run()

    })


    return  features ? features?.features?.map((feature, index) => <path ref={+feature.id === selectedCountry && feature.properties.name !== 'Ashmore and Cartier Is.' ? selectedCountryClick : undefined }   onClick={clicked(feature)} onMouseOver={mouseOverHandler(feature)} onMouseLeave={mouseLeaveHandler}  className={styles.svg__country} key={index} fill={fillHandler(feature)} d={path(feature)}/>) : null
}

export default React.memo(Paths);