import ContinentsSection from "../../components/ContinentsSection/ContinentsSection";
import CountriesSection from "../../components/CountriesSection/CountriesSection";
import HomeHeader from "../../components/HomeHeader/HomeHeader";

const Home = ({searchedCountry, sectionCoordinatesFn, setStickyNav}) => {



    return (
        <>
            <HomeHeader setStickyNav={setStickyNav}/>
            <ContinentsSection/>
            <CountriesSection searchedCountry={searchedCountry}  sectionCoordinatesFn={sectionCoordinatesFn}/>
        </>
    )

}

export default Home;