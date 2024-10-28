import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import Dashboard from "./components/Dashboard";
import DetailReport from "./components/DetailReport";
import UserManagement from "./components/ManageUser";
import UserPostProfile from "./components/UserPostProfile";
import UserSavedPost from "./components/UserSavedPost";
import CommunityPage from "./components/CommunityWall";
import CreateCommunity from "./components/CreateCommunity";
import CreatePost from "./components/CreatePost";
import EditPost from "./components/EditPost";
import HomeLogin from "./components/HomeLogin";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ResetPasswordForm />} />
          <Route path="/`create-username-password`" element={<CreateUPForm />}/>
          
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/post/:id" element={<PostDetail />} />
          
            <Route path="/profile/:id" element={<UserProfile />} />
            <Route path="/profile/:id/posts" element={<UserPostProfile />} />
            <Route path="/profile/:id/saved" element={<UserSavedPost />} />

            <Route path="/setting" element={<SettingProfile />} />

            <Route path="/community/:id" element={<CommunityPage />} />
            <Route path="/create-community" element={<CreateCommunity />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/edit-post/:id" element={<EditPost />} />
          </Route>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report/:id" element={<DetailReport />} />
          <Route path="/users" element={<UserManagement />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
