import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const CreateUPForm = () => {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleRegister = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        // Check username and student code availability
        const responseUsername = await fetch("http://localhost:9999/api/v1/users/check-username", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });
        const responseStuCode = await fetch("http://localhost:9999/api/v1/users/check-student-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentCode }),
        });

        if (!responseUsername.ok || !responseStuCode.ok) {
          const errorData = await responseUsername.json();
          setErrors({ form: errorData.message || "Username or student code already taken." });
          return;
        }

        // Register user
        const signupResponse = await fetch("http://localhost:9999/api/v1/users/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username, password, studentCode }),
        });

        if (signupResponse.ok) {
          // Redirect to login page with success message
          navigate("/login");
          toast.success("Đăng ký thành công!");
        } else {
          const errorData = await signupResponse.json();
          setErrors({ form: errorData.message || "Signup failed. Please try again." });
        }
      } catch (error) {
        console.error("Error during signup:", error);
        setErrors({ form: "An error occurred. Please try again later." });
      } finally {
        setLoading(false);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = "Username is required.";
    if (!password || password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (!studentCode || !/^(HE|HA|HS)\d{6}$/.test(studentCode)) newErrors.studentCode = "Invalid student code format.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBack = () => {
    navigate("/signup");
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Row>
        <Col>
          {isSuccess ? (
            <div className="text-center">
              <img
                src="../images/logo.jpg"
                alt="Confirmation"
                style={{ width: "150px", marginBottom: "20px" }}
              />
              <h2>Registration Successful!</h2>
              <p>A confirmation email has been sent. Please check your inbox to verify successful registration.</p>
              <Button
                onClick={() => navigate("/login")}
                className="mt-4"
                style={{
                  borderRadius: "20px",
                  backgroundColor: "#ff5e00",
                }}
              >
                Go to Login
              </Button>
            </div>
          ) : (
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
                <h2 className="fw-bold">Create your username and password</h2>
                <h6 className="mb-4 fw-normal">
                  Your username will be used for login instead of your email and
                  it will be used for your profile. Choose wisely - because once
                  you get a name, you can't change it.
                </h6>

                <Form noValidate onSubmit={handleRegister}>
                  {errors.form && (
                    <div className="text-danger mb-3">{errors.form}</div>
                  )}

                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Control
                      type="email"
                      value={email}
                      readOnly={true}
                      style={{
                        borderRadius: "20px",
                        height: "60px",
                        backgroundColor: "#d7d6d6",
                      }}
                      disabled
                    />
                  </Form.Group>

                  <Form.Group controlId="studentCode" className="mt-3">
                    <Form.Control
                      type="text"
                      placeholder="Student Code *"
                      value={studentCode}
                      onChange={(e) => setStudentCode(e.target.value)}
                      required
                      isInvalid={!!errors.studentCode}
                      style={{
                        borderRadius: "20px",
                        height: "60px",
                        backgroundColor: "#d7d6d6",
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.studentCode}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mt-3" controlId="username">
                    <Form.Control
                      type="username"
                      placeholder="Username *"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      isInvalid={!!errors.username}
                      style={{
                        borderRadius: "20px",
                        height: "60px",
                        backgroundColor: "#d7d6d6",
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mt-3" controlId="displayName">
                    <Form.Control
                      type="displayName"
                      placeholder="Display Name *"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                      isInvalid={!!errors.displayName}
                      style={{
                        borderRadius: "20px",
                        height: "60px",
                        backgroundColor: "#d7d6d6",
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.displayName}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="formPassword" className="mt-3">
                    <Form.Control
                      type="password"
                      placeholder="Password *"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      isInvalid={!!errors.password}
                      style={{
                        borderRadius: "20px",
                        height: "60px",
                        backgroundColor: "#d7d6d6",
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="mt-4 w-100"
                    disabled={loading}
                    style={{
                      borderRadius: "20px",
                      height: "45px",
                      backgroundColor: "#ff5e00",
                    }}
                  >
                    {loading ? "Loading..." : "Continue"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateUPForm;
