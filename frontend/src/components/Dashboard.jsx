import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import ReportTable from "./ReportTable";
import LayoutWithSidebar from "./LayoutWithSidebar";
import { getReportStats } from "../services/ReportService";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [totalReports, setTotalReports] = useState(0);
  const [processedReports, setProcessedReports] = useState(0);
  const [unprocessedReports, setUnprocessedReports] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getReportStats();
        setTotalReports(stats.totalReports);
        setProcessedReports(stats.processedReports);
        setUnprocessedReports(stats.unprocessedReports);
      } catch (error) {
        console.error("Error fetching report stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <LayoutWithSidebar>
      <Container fluid>
        <Row className="mt-4">
          <Col md={4}>
            <Card className="dashboard-custom-card">
              <Card.Body className="dashboard-card-body">
                <Card.Title className="dashboard-card-title">
                  Tổng số bài báo cáo
                </Card.Title>
                <Card.Text className="dashboard-card-text">
                  {totalReports}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="dashboard-custom-card">
              <Card.Body className="dashboard-card-body">
                <Card.Title className="dashboard-card-title">
                  Bài chưa xử lý
                </Card.Title>
                <Card.Text className="dashboard-card-text">
                  {unprocessedReports}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="dashboard-custom-card">
              <Card.Body className="dashboard-card-body">
                <Card.Title className="dashboard-card-title">
                  Bài đã xử lý
                </Card.Title>
                <Card.Text className="dashboard-card-text">
                  {processedReports}
                </Card.Text>
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
