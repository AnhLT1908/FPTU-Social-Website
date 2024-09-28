import "./App.css";
import React from "react";
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./components/Header";
import HomePage from "./components/HomePage";

import LoginForm from "./components/Login";
import RegisterForm from "./components/Register";
import CreateUPForm from "./components/CreateUsernamePassword";
import ResetPasswordForm from "./components/ForgotPassword";

function App() {
  return <div className="App">
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/create-username-password" element={<CreateUPForm />} />
        <Route path="/forgot-password" element={<ResetPasswordForm />} />
      </Routes>
    </BrowserRouter>
  </div>;
}

export default App;
