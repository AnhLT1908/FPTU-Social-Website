import React, { useState, useEffect } from 'react';
import { Table, Button, Form, InputGroup, Pagination, Card, Row, Col } from 'react-bootstrap';
import LayoutWithSidebar from './LayoutWithSidebar';
import { getListUser, toggleUserStatus } from '../services/UserAdminService';
import '../styles/dashboard.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getListUser(currentPage, 5, '', '', searchTerm);
      setUsers(data.data);
      setTotalUsers(data.total);
      setTotalPages(data.totalPages);
      setActiveUsers(data.activeUsersCount);
      setInactiveUsers(data.inactiveUsersCount);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleToggleStatus = async (userId) => {
    try {
      await toggleUserStatus(userId);
      await fetchUsers(); // Re-fetch to update statistics
    } catch (error) {
      setError('Failed to update user status.');
    }
  };

  return (
    <LayoutWithSidebar>
      <div className="container mt-4">
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Statistics */}
        <Row className="mb-4">
          <Col md={3}><CardStat title="Total Accounts" value={totalUsers} /></Col>
          <Col md={3}><CardStat title="Active Accounts" value={activeUsers} /></Col>
          <Col md={3}><CardStat title="Inactive Accounts" value={inactiveUsers} /></Col>
          <Col md={3}><CardStat title="Admin" value={users.filter(user => user.role === 'admin').length} /></Col>
        </Row>

        {/* Search Bar */}
        <InputGroup className="mb-3 search-bar">
          <Form.Control type="text" placeholder="Search by username..." value={searchTerm} onChange={handleSearch} />
        </InputGroup>

        {loading ? (
          <div className="text-center my-4"><span>Loading...</span></div>
        ) : (
          <Table striped bordered hover responsive className="user-table">
            <thead><tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
            {users
  .filter(user => user.role === 'student') // Lọc những người dùng có role là "student"
  .map(user => (
    <tr key={user.id}>
      <td>{user.id}</td>
      <td>{user.username}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>{user.isActive ? 'Active' : 'Inactive'}</td>
      <td>
        <Button variant="primary" size="sm" onClick={() => handleToggleStatus(user.id)}>
          {user.isActive ? 'Deactivate' : 'Activate'}
        </Button>
      </td>
    </tr>
  ))}

            </tbody>
          </Table>
        )}

        {/* Pagination */}
        <Pagination className="justify-content-center">
          {[...Array(totalPages).keys()].map(number => (
            <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => setCurrentPage(number + 1)}>
              {number + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </LayoutWithSidebar>
  );
};

// CardStat component for statistics display
const CardStat = ({ title, value }) => (
  <Card className="text-center dashboard-custom-card">
    <Card.Body className="dashboard-card-body">
      <Card.Title className="dashboard-card-title">{title}</Card.Title>
      <Card.Text className="dashboard-card-text">{value}</Card.Text>
    </Card.Body>
  </Card>
);

export default UserManagement;
