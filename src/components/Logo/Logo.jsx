import styles from "./Logo.module.css";
import image from "../../assets/corona.svg";
import {Link} from "react-router-dom";

function Logo() {

    return (
        <Link to={"/"} className={styles.header__logo}>
            <span>C</span>
            <span><img className={styles.header__logo__svg} src={image} alt="Virus"/></span>
            <span>vidStat</span>
        </Link>
    )
}

export default Logo;