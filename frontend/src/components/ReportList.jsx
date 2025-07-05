import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { message } from "antd";

const ReportList = () => {
  const [reports, setReports] = useState([]); // Lưu dữ liệu báo cáo
  const [page, setPage] = useState(1); // Số trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get(
          "http://localhost:9999/api/v1/reports/v2"
        );
        setReports(response.data.data); // Lưu danh sách báo cáo vào state
        setTotalPages(response.data.totalPages); // Cập nhật tổng số trang
      } catch (error) {
        message.error("Error fetching reports: " + error.message); // Hiển thị lỗi nếu có
      }
    };

    fetchReports();
  }, [page]);

  return (
    <div>
      <h2>Report List</h2>
      {/* Hiển thị danh sách báo cáo */}
      {reports.map((report) => (
        <div
          key={report._id}
          style={{ border: "1px solid #ddd", margin: "10px", padding: "10px" }}
        >
          <p>
            <strong>User:</strong> {report.userId?.username || "N/A"}
          </p>
          <p>
            <strong>Entity:</strong> {report.entityType}
          </p>
          <p>
            <strong>Description:</strong> {report.description}
          </p>
          <p>
            <strong>Status:</strong> {report.status}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(report?.createdAt).toLocaleString()}
          </p>
        </div>
      ))}

      {/* Nút phân trang */}
      <div>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>
          {" "}
          Page {page} of {totalPages}{" "}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReportList;
