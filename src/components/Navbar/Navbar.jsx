import image from "../../assets/corona.svg";
import styles from './Navbar.module.css'

const Navbar = () => {

    return (
        <header className={styles.header}>
            <a href="#" className={styles.header__logo}>
                <span>C</span>
                <span><img className={styles.header__logo__svg} src={image} alt=""/></span>
                <span>vidStat</span>
            </a>
            <nav>
                <ul>

                </ul>
            </nav>
        </header>
    )
}

export default Navbar;