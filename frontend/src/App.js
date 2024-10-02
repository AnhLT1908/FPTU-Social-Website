import "./App.css";
import React from "react";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import PostDetail from "./components/PostDetail";

import LoginForm from "./components/Login";
import RegisterForm from "./components/Register";
import CreateUPForm from "./components/CreateUsernamePassword";
import ResetPasswordForm from "./components/ForgotPassword";
import Layout from "./components/Layout";
import UserProfile from "./components/UserProfile";
import SettingProfile from "./components/SettingProfle";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/profile/:id" element={<UserProfile />} />
            <Route path="/setting" element={<SettingProfile />} />
            <Route
              path="/create-username-password"
              element={<CreateUPForm />}
            />
            <Route path="/forgot-password" element={<ResetPasswordForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
