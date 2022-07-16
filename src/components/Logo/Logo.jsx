import styles from "./Logo.module.css";
import image from "../../assets/corona.svg";

function Logo() {

    return (
        <a href="#" className={styles.header__logo}>
            <span>C</span>
            <span><img className={styles.header__logo__svg} src={image} alt="Virus"/></span>
            <span>vidStat</span>
        </a>
    )
}

export default Logo;