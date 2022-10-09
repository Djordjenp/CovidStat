import './App.module.css'
import {Routes, Route, useLocation,} from "react-router-dom";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import {useState} from "react";
import Country from "./pages/CountryPage/Country";
import CountryInfo from "./components/CountryInfo/CountryInfo";
import {Flipper} from "react-flip-toolkit";

function App() {
    let [searchedCountry, setSearchedCountry] = useState('')
    let [stickyNav, setStickyNav] = useState(false)
    let location = useLocation()

  return (
    <>
        <Navbar onSearch={setSearchedCountry}  shouldBeSticky={stickyNav}/>

        <Flipper flipKey={location.pathname}>
            <Routes>
                <Route path="/" element={<Home searchedCountry={searchedCountry}  setStickyNav={setStickyNav} />} />
                <Route path="/country" element={<Country setStickyNav={setStickyNav} />}>
                     <Route path=":countryName" element={<CountryInfo />} />
                </Route>
            </Routes>
        </Flipper>
    </>
  )
}

export default App
