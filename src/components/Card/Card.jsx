import styles from "./Card.module.css"
import {always, cond, equals, T} from "ramda";
import {numberWithCommas} from "../../helpers/utils";

const Card = ({type, data, date}) => {

   const typeOfCard = cond([
        [equals('deaths'), always('GLOBALLY DIED')],
        [equals('recovered'), always('GLOBALLY RECOVERED')],
        [T, always('GLOBALLY INFECTED')]
    ]);

    const cardTitle = typeOfCard(type)

    const normalDate = new Date(date).toLocaleDateString('en-US')

    const pseudoElement = {
        position: 'absolute',
        content: '',
        top: 0,
        left: 0,
        width: '100%',
        height: '3%',
        backgroundColor: `var(--card-${type})`,
    }

    return (
        <figure className={`${styles.card} flex-col`}>
            <div style={pseudoElement} />
            <figcaption className={`${styles['card__info--text']} flex`}>{cardTitle}</figcaption>
            <span className={`${styles['card__info--number']}`} style={{color:  `var(--card-${type})`}}>{numberWithCommas(data)}</span>
            <span className={`${styles['card__info--date']}`}>Last Updated: {normalDate}</span>
        </figure>
    )
}

export default Card;