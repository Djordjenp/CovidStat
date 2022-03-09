import styles from './App.module.css'
import {Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";

function App() {

  return (
    <div>
      <Routes>
          <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
