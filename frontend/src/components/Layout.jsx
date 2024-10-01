import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <>
      <Header />
      <div className='container-fluid'>
        <main>
          <div className='left-sidebar'>
            <Sidebar />
          </div>
          <div className='content'>
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}

export default Layout;
