import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import ReportTable from './ReportTable';
import LayoutWithSidebar from './LayoutWithSidebar';
import '../styles/dashboard.css'
const Dashboard = () => {
    return (
       <LayoutWithSidebar>
           <Container fluid>
               <Row className="mt-4">
                   <Col md={3}>
                       <Card className="custom-card">
                           <Card.Body className="card-body">
                               <Card.Title className="card-title">Tổng số bài báo cáo</Card.Title>
                               <Card.Text className="card-text">120</Card.Text>
                           </Card.Body>
                       </Card>

                   </Col>
                   <Col md={3}>
                       <Card className="custom-card">
                           <Card.Body className="card-body">
                               <Card.Title className="card-title">Bài chưa xử lý</Card.Title>
                               <Card.Text lassName="card-text">30</Card.Text>
                           </Card.Body>
                       </Card>
                   </Col>
                   <Col md={3}>
                       <Card className="custom-card">
                           <Card.Body className="card-body">
                               <Card.Title className="card-title">Bài đã xử lý</Card.Title>
                               <Card.Text lassName="card-text" >90</Card.Text>
                           </Card.Body>
                       </Card>
                   </Col>
                   <Col md={3}>
                       <Card className="custom-card">
                           <Card.Body className="card-body">
                               <Card.Title className="card-title">Người dùng bị khóa</Card.Title>
                               <Card.Text lassName="card-text">10</Card.Text>
                           </Card.Body>
                       </Card>
                   </Col>
               </Row>

               <Row className="mt-4">
                   <Col >
                       <h4 className="card-title">Danh sách bài báo cáo</h4>
                       <ReportTable />
                   </Col>
               </Row>
           </Container>
       </LayoutWithSidebar>
    );
};

export default Dashboard;
