import styles from './Home.module.css'
import image from '../../assets/corona.svg'
import Card from "../../components/Card/Card";

const Home = () => {

    return(
        <section className={`container ${styles['section-header']} `}>

                <h1 className={styles.header__logo}>
                    <span>C</span>
                    <span className={styles.header__logo__container}><img className={styles.header__logo__svg} src={image} alt=""/></span>
                    <span>vidStat</span>
                </h1>


            <div className={`flex-col  ${styles.home__card__container}` }>
                <Card color={"var(--clr-red"} type={'death'} />
                <Card color={"var(--clr-violet)"} type={'infected'} />
                <Card color={"var(--clr-green)"} type={'recovery'} />
            </div>

        </section>
    )
}

export default Home;