import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle login logic if form is valid
      console.log({ email, password });
      try {
        
      } catch (error) {
        console.error("Error at login", error); 
      }
    } else {
      setValidated(true); // Set validated state to true to show errors
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation (basic regex for email format)
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format.";
    }

    // Password validation (min length 6)
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);

    // If no errors, return true
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleSuccess = (credentialResponse) => {
    const details = jwtDecode(credentialResponse.credential);
    console.log("Logged in user:", details);
  };

  const handleGoogleError = () => {
    console.log("Google Sign-In was unsuccessful");
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
              <img src="../images/logo.jpg" alt="Logo" className="mb-3" style={{ width: "100px" }}/>
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
                    onError={handleGoogleError}
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

                  <div className="mt-3">
                    <a href="/forgot-password" style={{ textDecoration: "none", color: "#0086c9" }}>
                      Forgot Password?
                    </a>
                  </div>

                  <div className="mt-3">
                    New to our community?{" "}
                    <a href="/register" style={{ textDecoration: "none", color: "#0086c9" }}>
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
