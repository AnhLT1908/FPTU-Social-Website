import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import ReportTable from './ReportTable';
import LayoutWithSidebar from './LayoutWithSidebar';
import '../styles/dashboard.css';

const Dashboard = () => {
    return (
        <LayoutWithSidebar>
            <Container fluid>
                <Row className="mt-4">
                    <Col md={3}>
                        <Card className="dashboard-custom-card">
                            <Card.Body className="dashboard-card-body">
                                <Card.Title className="dashboard-card-title">Tổng số bài báo cáo</Card.Title>
                                <Card.Text className="dashboard-card-text">120</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="dashboard-custom-card">
                            <Card.Body className="dashboard-card-body">
                                <Card.Title className="dashboard-card-title">Bài chưa xử lý</Card.Title>
                                <Card.Text className="dashboard-card-text">30</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="dashboard-custom-card">
                            <Card.Body className="dashboard-card-body">
                                <Card.Title className="dashboard-card-title">Bài đã xử lý</Card.Title>
                                <Card.Text className="dashboard-card-text">90</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="dashboard-custom-card">
                            <Card.Body className="dashboard-card-body">
                                <Card.Title className="dashboard-card-title">Người dùng bị khóa</Card.Title>
                                <Card.Text className="dashboard-card-text">10</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mt-4">
                    <Col>
                        <h4 className="dashboard-card-title">Danh sách bài báo cáo</h4>
                        <ReportTable />
                    </Col>
                </Row>
            </Container>
        </LayoutWithSidebar>
    );
};

export default Dashboard;
