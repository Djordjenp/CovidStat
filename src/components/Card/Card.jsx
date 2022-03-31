import styles from "./Card.module.css"
import {always, cond, equals, T} from "ramda";
const Card = ({color, type}) => {

   const typeOfCard = cond([
        [equals('death'), always('GLOBALLY DIED')],
        [equals('recovery'), always('GLOBALLY RECOVERED')],
        [T, always('GLOBALLY INFECTED')]
    ]);

    const cardTitle = typeOfCard(type)

    const pseudoElement = {
        position: 'absolute',
        content: '',
        top: 0,
        left: 0,
        width: '100%',
        height: '3%',
        backgroundColor: color,
    }

    return (
        <figure className={`${styles.card} flex-col`}>
            <div style={pseudoElement} />
            <figcaption className={`${styles['card__info--text']} flex`}>{cardTitle}</figcaption>
            <span className={`${styles['card__info--number']}`} style={{color}}>5,856,224</span>
            <span className={`${styles['card__info--date']}`}>22.10.2022</span>
        </figure>
    )
}

export default Card;