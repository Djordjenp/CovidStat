import styles from './Navbar.module.css'
import {useEffect, useRef} from "react";
import useResizeObserver from "../../hooks/useResizeObserver";
import MobileNavBar from "./MobileNavBar/MobileNavBar";
import DesktopNavBar from "./DesktopNavBar/DesktopNavBar";
import {useIntersectionObserver} from "../../hooks/useIntersectionObserver";

const Navbar = ({onSearch, shouldBeSticky}) => {

    const headerRef = useRef(null);


    const size = useResizeObserver(headerRef, [
        { small: 600 },
    ])


    const renderDesktopBar =  () => <DesktopNavBar onSearch={onSearch} />
    const renderMobileBar = () => <MobileNavBar onSearch={onSearch} />

    return (
        <header ref={headerRef} className={`${styles.header} ${!shouldBeSticky ? styles.sticky : null}`}>
            {size === 'small' ? renderMobileBar() : renderDesktopBar()}
        </header>
    )
}

export default Navbar;