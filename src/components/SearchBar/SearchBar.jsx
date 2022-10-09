import styles from './SearchBar.module.css'
import {useState} from "react";
import useScrollToCountriesStore from "../../store/scrollStore";

const SearchBar = ({onSearch}) => {
    const setShouldScroll = useScrollToCountriesStore((state) => state.setShouldScroll)

    const [enteredInput, setEnteredInput] = useState('')

    const inputHandler = (e) => {
        setEnteredInput(e.target.value)
        onSearch(e.target.value)
    }

    const searchForCountry = (e) => {
        e.preventDefault();
        setShouldScroll(true)
        onSearch(enteredInput)
    }



    return (
        <form  onSubmit={searchForCountry} role={"search"} className={styles.search}>
            <input onInput={inputHandler} className={styles.search__input} placeholder={"search for country"}  type={"text"} name={"search"} id={"search"}/>
            <button className={`button ${styles.search__btn}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.search__icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
        </form>
    )
}

export default SearchBar;