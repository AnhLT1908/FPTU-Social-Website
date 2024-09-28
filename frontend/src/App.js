import "./App.css";
import React from "react";
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginForm from "./components/Login";

function App() {
  return <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </BrowserRouter>
  </div>;
}

export default App;
