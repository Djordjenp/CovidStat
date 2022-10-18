import './App.module.css'
import {Routes, Route} from "react-router-dom";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import {useState} from "react";
import Country from "./pages/CountryPage/Country";
import CountryInfo from "./components/CountryInfo/CountryInfo";

function App() {

    let [searchedCountry, setSearchedCountry] = useState('')
    let [stickyNav, setStickyNav] = useState(false)

  return (
    <>
        <Navbar onSearch={setSearchedCountry}  shouldBeSticky={stickyNav}/>
            <Routes>
                <Route path="/" element={<Home searchedCountry={searchedCountry}  setStickyNav={setStickyNav} />} />
                <Route path="/country" element={<Country setStickyNav={setStickyNav} />}>
                     <Route path=":countryName" element={<CountryInfo />} />
                </Route>
            </Routes>
    </>
  )
}

export default App
