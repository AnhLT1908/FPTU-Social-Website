import "./App.css";
import React from "react";
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/" element="" />
      </Routes>
    </BrowserRouter>
  </div>;
}

export default App;
