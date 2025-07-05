import React from 'react';
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import SidebarAdmin from './SideBarAdmin'; // Ensure correct import path
import '../styles/navBarAdmin.css';

const LayoutWithSidebar = ({ children }) => {
    return (
        <Container fluid>
            <Navbar expand="lg" className="custom-navbar"> {/* Apply custom-navbar class */}
                <Navbar.Brand href="#">Dashboard</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                </Navbar.Collapse>
            </Navbar>
            <Row>
                <Col md={3}>
                    <SidebarAdmin />
                </Col>
                <Col md={9}>
                    <div className="p-3">
                        {children}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default LayoutWithSidebar;
