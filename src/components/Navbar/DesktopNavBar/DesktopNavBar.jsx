import styles from "./DesktopNavBar.module.css";
import SearchBar from "../../SearchBar/SearchBar";
import Logo from "../../Logo/Logo";

const DesktopNavBar = ({onSearch, sectionCoordinates}) => {

    return (
        <>
            <Logo />
            <nav className={styles.nav}>
                <ul className={styles.nav__list}>
                    <li><a className={"link"} href="#">Home</a></li>
                    <li><a className={"link"} href="#">Countries</a></li>
                </ul>
            </nav>

            <SearchBar onSearch={onSearch} sectionCoordinates={sectionCoordinates} />
        </>
    )
}

export default DesktopNavBar;