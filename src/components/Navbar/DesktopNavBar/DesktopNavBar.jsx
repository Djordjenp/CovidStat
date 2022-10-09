import styles from "./DesktopNavBar.module.css";
import SearchBar from "../../SearchBar/SearchBar";
import Logo from "../../Logo/Logo";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import useScrollToCountriesStore from "../../../store/scrollStore";

const DesktopNavBar = ({onSearch}) => {

    const setShouldScroll = useScrollToCountriesStore((state) => state.setShouldScroll)

    const location = useLocation();
    const navigate = useNavigate()

    const clickHandler = (e) => {
        e.preventDefault();

        if (location.pathname === '/'){
            setShouldScroll(true)
        }else {
            navigate(`/`)
            setShouldScroll(true)
        }

    }


    return (
        <>
            <Logo />
            <nav className={styles.nav}>
                <ul className={styles.nav__list}>
                    <li><Link className={"link"} to={"/"}>Home</Link></li>
                    <li><a onClick={clickHandler} className={"link"}>Countries</a></li>
                </ul>
            </nav>

            <SearchBar onSearch={onSearch}  />
        </>
    )
}

export default DesktopNavBar;