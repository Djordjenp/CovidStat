import styles from './Legend.module.css'
import {useState} from "react";
import image from '../../assets/Legend.svg'

const Legend = ({data}) => {

    const [isShown, setIsShown] = useState(false)


        const toggleLegend = () => {
            setIsShown(prevState => !prevState)
        }


    return isShown ?
                    <div className={styles.map__legend}>
                        <button onClick={toggleLegend} className={styles.map__legend__close}>&#x2715;</button>

                        {data.map(([text, color]) => <div key={color} className={styles.map__legend__element}>
                                                        <div className={`${styles.map__legend__color}`} style={{backgroundColor: color}}></div>
                                                        <span className={styles.map__legend__info}> {text} </span>
                                                    </div> )}

                    </div> :
                          <div onClick={toggleLegend} className={styles.map__legend__icon}>
                             <img src={image} alt="Legend Icon" />
                         </div>

}

export default Legend;