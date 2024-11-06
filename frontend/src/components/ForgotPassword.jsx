import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const [message, setMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(0); // State để lưu thời gian đếm ngược
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleReset = async (e) => {
    if (e) e.preventDefault(); // Kiểm tra nếu có sự kiện thì mới gọi preventDefault
    if (validateForm()) {
      try {
        const response = await axios.post(
          "http://localhost:9999/api/v1/users/forgot-password",
          { email }
        );
        setMessage(response.data.message);
        setErrors({});
        setEmailSent(true);
        setCountdown(60); // Đặt bộ đếm đếm ngược 60 giây
      } catch (error) {
        if (error.response && error.response.data) {
          setErrors({ email: error.response.data.message });
        } else {
          setErrors({
            email: "An unexpected error occurred. Please try again later.",
          });
        }
      }
    } else {
      setValidated(true);
    }
  };

  const handleResend = () => {
    if (countdown === 0) {
      setCountdown(60); // Đặt lại bộ đếm đếm ngược 60 giây
      handleReset(); // Gọi lại hàm gửi email reset password
    }
  };

  const handleBack = () => {
    navigate("/signup");
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation (basic regex for email format)
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[\w.%+-]+@fpt\.edu\.vn$/.test(email)) {
      newErrors.email = "Invalid email format.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      {emailSent ? (
        <div className="text-center">
          <div
            className="mb-4"
            style={{ cursor: "pointer" }}
            onClick={handleBack}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ width: "24px", height: "24px", marginRight: "500px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>

          <a href="/">
            <img
              src="../images/logo.jpg"
              alt="Confirmation"
              style={{ width: "150px", marginBottom: "20px" }}
            />
          </a>

          <h2>Check your mail</h2>
          <p>
            An email with a link to reset your password was sent to the email
            address associated with your account.
          </p>
          <p>
            Didn’t get an email?{" "}
            <Button
              variant="link"
              onClick={handleResend}
              disabled={countdown > 0}
              style={{ textDecoration: "none", padding: 0 }}
            >
              Resend {countdown > 0 && `(${countdown}s)`}
            </Button>
          </p>
        </div>
      ) : (
        <Row>
          <Col>
            <div className="text-center mb-4">
              <a href="/">
                <img
                  src="../images/logo.jpg"
                  href="/"
                  alt="Logo"
                  className="mb-3"
                  style={{ width: "100px" }}
                />
              </a>
              <h1>FPTU Social Website</h1>
              <p>The Internet Home Place, where many communities reside</p>
            </div>

            <Card className="p-4 shadow-sm" style={{ width: "500px" }}>
              <Card.Body>
                <div
                  className="mb-4"
                  style={{ cursor: "pointer" }}
                  onClick={handleBack}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ width: "24px", height: "24px" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </div>

                <h2 className="fw-bold">Reset your password</h2>
                <h6 className="mb-4 fw-normal">
                  Enter your email address, and we'll send you a new password.
                </h6>

                <Form noValidate validated={validated} onSubmit={handleReset}>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Control
                      type="email"
                      placeholder="Email *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      isInvalid={!!errors.email}
                      style={{
                        borderRadius: "20px",
                        height: "60px",
                        backgroundColor: "#d7d6d6",
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="mt-4 w-100"
                    style={{
                      borderRadius: "20px",
                      height: "45px",
                      backgroundColor: "#ff5e00",
                    }}
                  >
                    Reset password
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ResetPasswordForm;
