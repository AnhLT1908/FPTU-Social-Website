import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Image,
  Spinner,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import LayoutWithSidebar from "./LayoutWithSidebar";
import {
  getReportById,
  updateReport,
  deactivatePost,
} from "../services/ReportService";
import { message } from "antd";

const DetailReport = () => {
  const { id } = useParams();
  const [reportDetail, setReportDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isActionTaken, setIsActionTaken] = useState(false);

  useEffect(() => {
    const fetchReportDetail = async () => {
      try {
        const data = await getReportById(id);
        console.log("reportDetail", data);
        setReportDetail(data);
      } catch (error) {
        console.error("Error fetching report details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportDetail();
  }, [id]);

  const handleDeactivateAndApprove = async () => {
    try {
      await deactivatePost(reportDetail.reportEntityId?._id, "Approved");
      await updateReport(id, { status: "Approved" });
      message.success(
        "Bài viết đã bị vô hiệu hóa và báo cáo đã được phê duyệt."
      );
      setReportDetail((prev) => ({ ...prev, status: "Approved" }));
      setIsActionTaken(true);
    } catch (error) {
      message.error("Lỗi khi xử lý báo cáo: " + error.message);
    }
  };

  const handleCancelReport = async () => {
    try {
      await deactivatePost(reportDetail.reportEntityId._id, "Cancel");
      await updateReport(id, { status: "Cancel" });
      message.success("Báo cáo đã được hủy.");
      setReportDetail((prev) => ({ ...prev, status: "Cancel" }));
      setIsActionTaken(true);
    } catch (error) {
      message.error("Lỗi khi hủy báo cáo: " + error.message);
    }
  };

  if (loading) {
    return (
      <Spinner
        animation="border"
        variant="primary"
        className="d-block mx-auto mt-4"
      />
    );
  }

  if (!reportDetail) {
    return <div>Không tìm thấy chi tiết báo cáo</div>;
  }

  return (
    <LayoutWithSidebar>
      <Container className="d-flex justify-content-center mt-4">
        <Card className="w-75">
          <Card.Body>
            <Card.Title className="text-center mb-4">
              Chi tiết bài báo cáo ID: {reportDetail._id}
            </Card.Title>
            <Row className="align-items-center">
              <Col md={6} className="d-flex flex-column align-items-center">
                <Card.Text
                  className="text-start d-flex "
                  style={{ width: "350px" }}
                >
                  <strong style={{ marginRight: "10px" }} className="">
                    Người dùng đăng bài:{" "}
                  </strong>{" "}
                  <p> {reportDetail.userId?.username || "N/A"} </p>
                </Card.Text>
                <Card.Text
                  className="text-start d-flex"
                  style={{ width: "350px" }}
                >
                  <strong style={{ marginRight: "10px" }} className="">
                    Tiêu đề bài viết:
                  </strong>{" "}
                  <p>{reportDetail.reportEntityId?.title}</p>
                </Card.Text>
                <Card.Text
                  className="text-start d-flex"
                  style={{ width: "350px" }}
                >
                  <strong style={{ marginRight: "10px" }} className="">
                    Nội dung bài viết:
                  </strong>{" "}
                  <p>{reportDetail.reportEntityId?.content}</p>
                </Card.Text>
                <Card.Text
                  className="text-start d-flex"
                  style={{ width: "350px" }}
                >
                  <strong style={{ marginRight: "10px" }} className="">
                    Lý do báo cáo:
                  </strong>{" "}
                  <p>{reportDetail.description}</p>
                </Card.Text>
                <Card.Text
                  className="text-start d-flex"
                  style={{ width: "350px" }}
                >
                  <strong style={{ marginRight: "10px" }} className="">
                    Trạng thái:
                  </strong>
                  <p>{reportDetail.status}</p>
                </Card.Text>

                {reportDetail.status === "Waiting" && (
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
                <Image
                  style={{
                    width: "450px",
                    height: "450px",
                    objectFit: "cover",
                  }}
                  src={
                    reportDetail.reportEntityId?.media[0] ||
                    "default_image_url.jpg"
                  }
                  rounded
                  fluid
                  className="mb-2"
                />
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
