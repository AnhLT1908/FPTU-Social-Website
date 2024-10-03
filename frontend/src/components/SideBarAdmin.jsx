import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "../styles/sidebarAdmin.css";

const SidebarAdmin = () => {
    return (
        <div className="sidebar-admin d-flex flex-column vh-100 p-3">
            <h4>Admin Panel</h4>
            <Nav className="flex-column">
                <Nav.Item className="my-2">
                    <Link to="/dashboard" className="nav-link">
                        Dashboard
                    </Link>
                </Nav.Item>
                <Nav.Item className="my-2">
                    <Link to="/users" className="nav-link">
                        Quản lý tài khoản
                    </Link>
                </Nav.Item>
            </Nav>
        </div>
    );
};

export default SidebarAdmin;
