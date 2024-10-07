import React, { useState } from 'react';
import { Table, Button, Form, InputGroup, Pagination, Card, Row, Col } from 'react-bootstrap';
import LayoutWithSidebar from './LayoutWithSidebar';
import '../styles/dashboard.css';// Adjust the import path based on your project structure
// Import the CSS file

const UserManagement = () => {
    const [users, setUsers] = useState([
        { id: 1, username: 'admin', email: 'admin@example.com', role: 'Admin', status: 'Active' },
        { id: 2, username: 'user1', email: 'user1@example.com', role: 'User', status: 'Inactive' },
        { id: 3, username: 'user2', email: 'user2@example.com', role: 'User', status: 'Active' },
        { id: 4, username: 'user3', email: 'user3@example.com', role: 'User', status: 'Active' },
        { id: 5, username: 'user4', email: 'user4@example.com', role: 'User', status: 'Inactive' },
        { id: 6, username: 'user5', email: 'user5@example.com', role: 'User', status: 'Active' },
        { id: 7, username: 'user6', email: 'user6@example.com', role: 'User', status: 'Inactive' },
        { id: 8, username: 'user7', email: 'user7@example.com', role: 'User', status: 'Active' },
        { id: 9, username: 'user8', email: 'user8@example.com', role: 'User', status: 'Active' },
        { id: 10, username: 'user9', email: 'user9@example.com', role: 'User', status: 'Inactive' },
        { id: 11, username: 'user10', email: 'user10@example.com', role: 'User', status: 'Active' },
        { id: 12, username: 'user11', email: 'user11@example.com', role: 'User', status: 'Inactive' },
        { id: 13, username: 'user12', email: 'user12@example.com', role: 'User', status: 'Active' },
        { id: 14, username: 'user13', email: 'user13@example.com', role: 'User', status: 'Inactive' },
        { id: 15, username: 'user14', email: 'user14@example.com', role: 'User', status: 'Active' },
        { id: 16, username: 'user15', email: 'user15@example.com', role: 'User', status: 'Inactive' },
    ]);
    

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users
        .filter((user) => user.username.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(indexOfFirstUser, indexOfLastUser);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(users.length / usersPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const handleClick = (number) => {
        setCurrentPage(number);
    };

    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status === 'Active').length;
    const inactiveUsers = users.filter(user => user.status === 'Inactive').length;
    const adminUsers = users.filter(user => user.role === 'Admin').length;

    const handleEdit = (id) => {
        alert(`Edit user with ID ${id}`);
    };

    const handleDelete = (id) => {
        const newUsers = users.filter(user => user.id !== id);
        setUsers(newUsers);
        alert(`Delete user with ID ${id}`);
    };

    return (
        <LayoutWithSidebar>
            <div className="container mt-4">
                {/* Statistics */}
                <Row className="mb-4">
                    <Col md={3}>
                        <Card className="text-center dashboard-custom-card">
                            <Card.Body className="dashboard-card-body">
                                <Card.Title className="dashboard-card-title">Total Accounts</Card.Title>
                                <Card.Text className="dashboard-card-text">{totalUsers}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center dashboard-custom-card">
                            <Card.Body className="dashboard-card-body">
                                <Card.Title className="dashboard-card-title">Active Accounts</Card.Title>
                                <Card.Text className="dashboard-card-text">{activeUsers}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center dashboard-custom-card">
                            <Card.Body className="dashboard-card-body">
                                <Card.Title className="dashboard-card-title">Inactive Accounts</Card.Title>
                                <Card.Text className="dashboard-card-text">{inactiveUsers}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center dashboard-custom-card">
                            <Card.Body className="dashboard-card-body">
                                <Card.Title className="dashboard-card-title">Admin</Card.Title>
                                <Card.Text className="dashboard-card-text">{adminUsers}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Search Bar */}
                <InputGroup className="mb-3 search-bar">
                    <Form.Control
                        type="text"
                        placeholder="Search by username..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </InputGroup>

                {/* User Table */}
                <Table striped bordered hover responsive className="user-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentUsers.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.status}</td>
                            <td>
                                <Button variant="primary" size="sm" className="me-2" onClick={() => handleEdit(user.id)}>Edit</Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>

                {/* Pagination */}
                <Pagination className="justify-content-center">
                    {pageNumbers.map(number => (
                        <Pagination.Item key={number} active={number === currentPage} onClick={() => handleClick(number)}>
                            {number}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </div>
        </LayoutWithSidebar>
    );
};

export default UserManagement;