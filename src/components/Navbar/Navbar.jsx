import image from "../../assets/corona.svg";
import styles from './Navbar.module.css'
import SearchBar from "../SearchBar/SearchBar";
import {useState} from "react";

const Navbar = ({onSearch, sectionCoordinates}) => {



    return (
        <header className={styles.header}>
            <a href="#" className={styles.header__logo}>
                <span>C</span>
                <span><img className={styles.header__logo__svg} src={image} alt="Virus"/></span>
                <span>vidStat</span>
            </a>


            <nav className={styles.nav}>
                <ul className={styles.nav__list}>
                    <li><a className={"link"} href="#">Home</a></li>
                    <li><a className={"link"} href="#">Countries</a></li>
                </ul>
            </nav>


            <SearchBar onSearch={onSearch} sectionCoordinates={sectionCoordinates} />

        </header>
    )
}

export default Navbar;