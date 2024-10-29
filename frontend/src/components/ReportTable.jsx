import React, { useEffect, useState } from 'react';
import { Table, Button, Pagination, Form, InputGroup, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/reportTable.css';
import { listReports } from '../services/ReportService';

const ReportTable = () => {
    const navigate = useNavigate();

    const [reports, setReports] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterEntityType, setFilterEntityType] = useState(''); // Thêm loại thực thể
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const reportsPerPage = 5;

    const fetchReports = async () => {
        try {
            const data = await listReports(currentPage, reportsPerPage, filterStatus, filterEntityType, searchTerm);
            setReports(data.data);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [currentPage, searchTerm, filterStatus, filterEntityType]);

    const handleClick = (number) => setCurrentPage(number);
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };
    const handleFilterStatusChange = (event) => {
        setFilterStatus(event.target.value);
        setCurrentPage(1);
    };
    const handleFilterEntityTypeChange = (event) => {
        setFilterEntityType(event.target.value);
        setCurrentPage(1);
    };

    const handleViewDetail = (id) => {
        navigate(`/report/${id}`);
    };

    const handleDelete = (id) => {
        const updatedReports = reports.filter((report) => report._id !== id);
        setReports(updatedReports);
    };

    return (
        <div className="container mt-4">
            <Row className="mb-3">
                <Col md={4}>
                    <InputGroup size="sm">
                        <Form.Control
                            type="text"
                            placeholder="Tìm kiếm theo mô tả..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </InputGroup>
                </Col>
                <Col md={3}>
                    <Form.Group size="sm">
                        <Form.Label className="me-2" style={{ fontSize: '14px' }}>Trạng thái:</Form.Label>
                        <Form.Select
                            value={filterStatus}
                            onChange={handleFilterStatusChange}
                            size="sm"
                            style={{ width: '150px', display: 'inline-block' }}
                        >
                            <option value="">Tất cả</option>
                            <option value="Waiting">Chưa xử lý</option>
                            <option value="Approved">Đã xử lý</option>
                            <option value="Cancel">Hủy</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group size="sm">
                        <Form.Label className="me-2" style={{ fontSize: '14px' }}>Loại thực thể:</Form.Label>
                        <Form.Select
                            value={filterEntityType}
                            onChange={handleFilterEntityTypeChange}
                            size="sm"
                            style={{ width: '150px', display: 'inline-block' }}
                        >
                            <option value="">Tất cả</option>
                            <option value="Post">Bài viết</option>
                            <option value="Comment">Bình luận</option>
                            <option value="User">Người dùng</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <Table striped bordered hover className="table">
                <thead>
                <tr>
                    <th>ID Bài Viết</th>
                    <th>Loại</th>
                    <th>Người dùng</th>
                    <th>Lý do báo cáo</th>
                    <th>Ngày báo cáo</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {reports
                // .filter(report =>report.entityType==='Post' )
                .map((report,key) => (
                    <tr key={report._id}>
                        <td>{key+1+(5*(currentPage-1))}</td>
                        <td>{report.entityType}</td>
                        <td>{report.userId?.username || "N/A"}</td>
                        <td>{report.description}</td>
                        <td>{new Date(report?.createdAt).toLocaleString()}</td>
                        <td>{report.status}</td>
                        <td>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleViewDetail(report._id)}
                            >
                                Xem chi tiết
                            </Button>
                          
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <Pagination size="sm" className="pagination justify-content-center">
                {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => handleClick(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </div>
    );
};

export default ReportTable;
