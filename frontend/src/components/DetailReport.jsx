import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import LayoutWithSidebar from './LayoutWithSidebar';
const DetailReport = () => {
    const { id } = useParams();

    // Giả sử đây là chi tiết của bài báo cáo (có thể lấy từ API hoặc state)
    const reportDetail = {
        id: id,
        user: 'Nguyễn Văn A',
        content: 'Nội dung bài viết...',
        reason: 'Spam',
        status: 'Chưa xử lý',
    };

    return (
       <LayoutWithSidebar>
           <Container className="mt-4">
               <Card>
                   <Card.Body>
                       <Card.Title>Chi tiết bài báo cáo ID: {reportDetail.id}</Card.Title>
                       <Card.Text>
                           <strong>Người dùng đăng bài:</strong> {reportDetail.user}
                       </Card.Text>
                       <Card.Text>
                           <strong>Nội dung bài viết:</strong> {reportDetail.content}
                       </Card.Text>
                       <Card.Text>
                           <strong>Lý do báo cáo:</strong> {reportDetail.reason}
                       </Card.Text>
                       <Card.Text>
                           <strong>Trạng thái:</strong> {reportDetail.status}
                       </Card.Text>
                       <Button variant="success" className="me-2">
                           Đánh dấu là Đã xử lý
                       </Button>
                       <Button variant="danger">Xóa bài viết</Button>
                   </Card.Body>
               </Card>
           </Container>
       </LayoutWithSidebar>
    );
};

export default DetailReport;
