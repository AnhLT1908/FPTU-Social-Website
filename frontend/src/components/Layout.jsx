import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, Navigate } from "react-router-dom";
import socket from "../services/socketClient";
function Layout() {
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    socket?.emit("joinRoom", user?.id);
  }, [socket, user]);
  return user ? (
    <>
      <Header socket={socket} />
      <div className="container-fluid">
        <main>
          <div className="left-sidebar">
            <Sidebar />
          </div>
          <div className="content">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  ) : (
    <Navigate to="/login" />
  );
}

export default Layout;
