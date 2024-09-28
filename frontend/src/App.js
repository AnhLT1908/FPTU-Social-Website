import "./App.css";
import React from "react";
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginForm from "./components/Login";
import RegisterForm from "./components/Register";

function App() {
  return <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </BrowserRouter>
  </div>;
}

export default App;
