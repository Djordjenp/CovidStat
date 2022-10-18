import styles from "./MobileNavBar.module.css";
import {useState} from "react";
import Logo from "../../Logo/Logo";
import SearchBar from "../../SearchBar/SearchBar";
import {Link, useLocation, useNavigate} from "react-router-dom";
import useScrollToCountriesStore from "../../../store/scrollStore";

const MobileNavBar = ({onSearch}) => {
    let [isSearching, setIsSearching] = useState(false)
    const setShouldScroll = useScrollToCountriesStore((state) => state.setShouldScroll)

    const location = useLocation();
    const navigate = useNavigate()


    function handleSearch() {
        setIsSearching(true)
    }

    function returnSearch() {
        setIsSearching(false)
    }


    function clickHandler() {
        if (location.pathname === '/'){
            setShouldScroll(true)
        }else {
            navigate(`/`)
            setShouldScroll(true)
        }
    }

    return isSearching ?
                    <>
                        <button onClick={returnSearch} className={`button ${styles.back__btn}`}>
                            <svg  xmlns="http://www.w3.org/2000/svg" className={styles.back__icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <SearchBar onSearch={onSearch} />
                        <button className={`button ${styles.search__btn}`} >
                            <svg onClick={handleSearch} xmlns="http://www.w3.org/2000/svg" className={styles.search__icon} fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </button>
                    </>
                    :
                    <>
                        <Logo />
                        <div className={styles.search__wrapper}>
                            <Link className={`link ${styles.navbar__link}`} to={"/"}>Home</Link>
                            <a onClick={clickHandler} className={`link ${styles.navbar__link}`}>Countries</a>

                            <svg onClick={handleSearch} xmlns="http://www.w3.org/2000/svg" className={styles.search__icon} fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </div>
                    </>



}

export default MobileNavBar;