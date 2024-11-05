import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Row, Col, Image, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import LayoutWithSidebar from './LayoutWithSidebar';
import { getReportById, updateReport, deactivatePost } from '../services/ReportService'; // Import các hàm cần thiết từ service
import { message } from 'antd';

const DetailReport = () => {
    const { id } = useParams();
    const [reportDetail, setReportDetail] = useState(null); // State để lưu dữ liệu chi tiết
    const [loading, setLoading] = useState(true); // State để quản lý trạng thái tải dữ liệu
    const [isActionTaken, setIsActionTaken] = useState(false); // State để theo dõi hành động đã được thực hiện

    useEffect(() => {
        const fetchReportDetail = async () => {
            try {
                const data = await getReportById(id); // Gọi API và nhận dữ liệu
                setReportDetail(data);
            } catch (error) {
                console.error('Error fetching report details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReportDetail();
    }, [id]);

    const handleDeactivateAndApprove = async () => {
        try {
            // Gọi hàm deactivate bài viết
            await deactivatePost(id);
            // Cập nhật trạng thái báo cáo thành "Approved"
            await updateReport(id, { status: 'Approved' });
            message.success('Bài viết đã bị vô hiệu hóa và báo cáo đã được phê duyệt.');
            setReportDetail(prev => ({ ...prev, status: 'Approved' }));
            setIsActionTaken(true); // Đánh dấu hành động đã được thực hiện
        } catch (error) {
            message.error('Lỗi khi xử lý báo cáo: ' + error.message);
        }
    };

    const handleCancelReport = async () => {
        try {
            await updateReport(id, { status: 'Cancel' });
            message.success('Báo cáo đã được hủy.');
            setReportDetail(prev => ({ ...prev, status: 'Cancel' }));
            setIsActionTaken(true); // Đánh dấu hành động đã được thực hiện
        } catch (error) {
            message.error('Lỗi khi hủy báo cáo: ' + error.message);
        }
    };

    if (loading) {
        return <Spinner animation="border" variant="primary" className="d-block mx-auto mt-4" />;
    }

    if (!reportDetail) {
        return <div>Không tìm thấy chi tiết báo cáo</div>;
    }

    return (
        <LayoutWithSidebar>
            <Container className="d-flex justify-content-center mt-4">
                <Card className="w-75">
                    <Card.Body>
                        <Card.Title className="text-center mb-4">Chi tiết bài báo cáo ID: {reportDetail._id}</Card.Title>
                        <Row className="align-items-center">
                            <Col md={6} className="d-flex flex-column align-items-center">
                                <Card.Text className="text-center">
                                    <strong>Người dùng đăng bài:</strong> {reportDetail.userId?.username || "N/A"}
                                </Card.Text>
                                <Card.Text className="text-start">
                                    <strong>Tiêu đề bài viết:</strong> {reportDetail.reportEntityId?.title}
                                </Card.Text>
                                <Card.Text className="text-start">
                                    <strong>Nội dung bài viết:</strong> {reportDetail.reportEntityId?.content}
                                </Card.Text>
                                <Card.Text className="text-start">
                                    <strong>Lý do báo cáo:</strong> {reportDetail.description}
                                </Card.Text>
                                <Card.Text className="text-start">
                                    <strong>Trạng thái:</strong> {reportDetail.status}
                                </Card.Text>
                                
                                {reportDetail.status === 'Waiting' && ( // Kiểm tra nếu status là 'Waiting'
                                    <div className="d-flex justify-content-center mt-2">
                                        <Button
                                            variant="success"
                                            className="me-2"
                                            onClick={handleDeactivateAndApprove}
                                            disabled={isActionTaken}
                                        >
                                            Đánh dấu là Đã xử lý
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={handleCancelReport}
                                            disabled={isActionTaken}
                                        >
                                            Hủy báo cáo
                                        </Button>
                                    </div>
                                )}
                            </Col>
                            <Col md={6} className="d-flex flex-column align-items-center">
                                <Image src={reportDetail.postImage || 'default_image_url.jpg'} rounded fluid className="mb-2" />
                                <Card.Text className="text-center mt-2">
                                    <strong>Hình ảnh bài viết</strong>
                                </Card.Text>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </LayoutWithSidebar>
    );
};

export default DetailReport;
