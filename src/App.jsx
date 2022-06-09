import './App.module.css'
import {Routes, Route, } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import {useState} from "react";

function App() {

    let [searchedCountry, setSearchedCountry] = useState('')
    let [sectionCoordinates, setSectionCoordinates] = useState(0)

  return (
    <>
        <Navbar onSearch={setSearchedCountry} sectionCoordinates={sectionCoordinates}/>
        <Routes>
            <Route path="/" element={<Home searchedCountry={searchedCountry} sectionCoordinatesFn={setSectionCoordinates} />} />
        </Routes>
    </>
  )
}

export default App
