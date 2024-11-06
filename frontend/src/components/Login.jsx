import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode"; // Adjusted import
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:9999/api/v1/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok && data.status === "success") {
          console.log("Login successful", data.user);

          // Save token and user data
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          // Redirect user based on role
          if (data.user.role === "student") {
            navigate("/"); // Redirect to home for students
          } else if (data.user.role === "admin") {
            navigate("/dashboard"); // Redirect to dashboard for admin
          }
        } else {
          console.error("Login failed", data.message);
          if (data.message === "Tài khoản của bạn đã bị vô hiệu hóa.") {
            toast.error(data.message); // Display the error using Toastify
          }
          setErrors({
            form: data.message || "Login failed. Please check your credentials.",
          });
        }
      } catch (error) {
        console.error("Error logging in", error);
        setErrors({
          form: "An error occurred while logging in. Please try again.",
        });
      }
    } else {
      setValidated(true);
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    const details = jwtDecode(credentialResponse.credential);

    if (details.email.endsWith("@fpt.edu.vn")) {
      // Send JWT token to backend for verification or account creation if it doesn't exist
      fetch("http://localhost:9999/api/v1/users/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redirect user based on role
            if (data.user.role === "student") {
              navigate("/"); // Redirect to home for students
            } else if (data.user.role === "admin") {
              navigate("/dashboard"); // Redirect to dashboard for admin
            }
          } else {
            console.error("Google login failed", data.message);
            if (data.message === "Tài khoản của bạn đã bị vô hiệu hóa.") {
              toast.error(data.message); // Display the error using Toastify
            }
            setErrors({ form: data.message });
          }
        });
    } else {
      setErrors({ form: "Email must be a FPT email!" });
    }
  };
  

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email or username is required.";
    } else if (
      !/^[\w.%+-]+@fpt\.edu\.vn$/.test(email) &&
      !/^[a-zA-Z0-9_]+$/.test(email)
    ) {
      newErrors.email = "Invalid email or username format.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleFailure = (error) => {
    console.error("Google login failed", error);
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
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
                <h2 className="fw-bold">Log In</h2>
                <h6 className="mb-4 fw-normal">
                  By continuing, you agree to our User Agreement and acknowledge
                  that you understand the Privacy Policy
                </h6>

                <div className="mb-2">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                    useOneTap
                  />
                </div>

                <div className="d-flex align-items-center my-2">
                  <div
                    className="flex-grow-1 bg-secondary"
                    style={{ height: "1px" }}
                  ></div>
                  <span className="mx-4 text-muted">OR</span>
                  <div
                    className="flex-grow-1 bg-secondary"
                    style={{ height: "1px" }}
                  ></div>
                </div>

                <Form noValidate validated={validated} onSubmit={handleLogin}>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Control
                      type="email"
                      placeholder="Email or username *"
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

                  {errors.form && (
                    <div className="text-danger mt-3">{errors.form}</div>
                  )}

                  <div className="mt-3">
                    <a
                      href="/forgot-password"
                      style={{ textDecoration: "none", color: "#0086c9" }}
                    >
                      Forgot Password?
                    </a>
                  </div>

                  <div className="mt-3">
                    New to our community?{" "}
                    <a
                      href="/signup"
                      style={{ textDecoration: "none", color: "#0086c9" }}
                    >
                      Sign up
                    </a>
                  </div>

                  <Button
                    type="submit"
                    className="mt-4 w-100"
                    style={{
                      borderRadius: "20px",
                      height: "45px",
                      backgroundColor: "#ff5e00",
                    }}
                  >
                    Log In
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </GoogleOAuthProvider>
  );
};

export default LoginForm;
