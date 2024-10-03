import React, { useState } from 'react';
import { Table, Button, Pagination, Form, InputGroup, Col, Row } from 'react-bootstrap';
import '../styles/reportTable.css'



const ReportTable = () => {
    // Dữ liệu giả về danh sách báo cáo
    const [reports, setReports] = useState([
        { id: 1, user: 'Nguyễn Văn A', reason: 'Spam', date: '2024-09-29', status: 'Chưa xử lý' },
        { id: 2, user: 'Trần Thị B', reason: 'Nội dung không phù hợp', date: '2024-09-28', status: 'Đã xử lý' },
        { id: 3, user: 'Lê Văn C', reason: 'Xúc phạm', date: '2024-09-27', status: 'Chưa xử lý' },
        { id: 4, user: 'Nguyễn Văn D', reason: 'Spam', date: '2024-09-26', status: 'Đã xử lý' },
        { id: 5, user: 'Trần Thị E', reason: 'Xúc phạm', date: '2024-09-25', status: 'Chưa xử lý' },
        { id: 6, user: 'Lê Văn F', reason: 'Nội dung không phù hợp', date: '2024-09-24', status: 'Chưa xử lý' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState(''); // Bộ lọc trạng thái báo cáo
    const [currentPage, setCurrentPage] = useState(1);
    const [reportsPerPage] = useState(3); // Số lượng báo cáo hiển thị trên mỗi trang

    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;

    // Lọc và tìm kiếm báo cáo
    const filteredReports = reports
        .filter((report) => {
            return (
                report.user.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (filterStatus ? report.status === filterStatus : true)
            );
        });

    const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
    const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const handleClick = (number) => setCurrentPage(number);
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };
    const handleFilterChange = (event) => {
        setFilterStatus(event.target.value);
        setCurrentPage(1);
    };


    return (

        <div className="container mt-4">
            {/* Thanh tìm kiếm và bộ lọc */}
            <Row className="mb-3">
                <Col md={4}>
                    <InputGroup size="sm">
                        <Form.Control
                            type="text"
                            placeholder="Tìm kiếm theo tên người dùng..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </InputGroup>
                </Col>
                <Col md={3}>
                    <Form.Group size="sm">
                        <Form.Label className="me-2" style={{fontSize: '14px'}}>Trạng thái:</Form.Label>
                        <Form.Select
                            value={filterStatus}
                            onChange={handleFilterChange}
                            size="sm" // Thu nhỏ nút lọc
                            style={{width: '150px', display: 'inline-block'}} // Giảm kích thước nút lọc
                        >
                            <option value="">Tất cả</option>
                            <option value="Chưa xử lý">Chưa xử lý</option>
                            <option value="Đã xử lý">Đã xử lý</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            {/* Bảng danh sách báo cáo */}
            <Table striped bordered hover className="table">
                <thead>
                <tr>
                    <th>ID Bài Viết</th>
                    <th>Người dùng</th>
                    <th>Lý do báo cáo</th>
                    <th>Ngày báo cáo</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {currentReports.map((report) => (
                    <tr key={report.id}>
                        <td>{report.id}</td>
                        <td>{report.user}</td>
                        <td>{report.reason}</td>
                        <td>{report.date}</td>
                        <td>{report.status}</td>
                       

                        <td>
                            <Button variant="primary" className="button-primary" size="sm">
                                Xem chi tiết
                            </Button>
                            <Button variant="danger" className="button-danger" size="sm">Xóa</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {/* Phân trang */}
            <Pagination size="sm" className="pagination justify-content-center">
                {pageNumbers.map((number) => (
                    <Pagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => handleClick(number)}
                    >
                        {number}
                    </Pagination.Item>
                ))}
            </Pagination>
        </div>


    );
};

export default ReportTable;
