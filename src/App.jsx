import './App.module.css'
import {Routes, Route, } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import {useState} from "react";
import Country from "./pages/CountryPage/Country";

function App() {
    let [searchedCountry, setSearchedCountry] = useState('')
    let [sectionCoordinates, setSectionCoordinates] = useState(0)
    let [stickyNav, setStickyNav] = useState(false)

  return (
    <>
        <Navbar onSearch={setSearchedCountry} sectionCoordinates={sectionCoordinates} shouldBeSticky={stickyNav}/>
        <Routes>
            <Route path="/" element={<Home searchedCountry={searchedCountry} sectionCoordinatesFn={setSectionCoordinates} setStickyNav={setStickyNav} />} />
            <Route path="/country" element={<Country setStickyNav={setStickyNav} />}  />
        </Routes>
    </>
  )
}

export default App
