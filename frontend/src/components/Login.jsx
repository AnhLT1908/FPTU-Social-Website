import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log({ email, password });
  };

 


  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Row>
        <Col>
          <div className="text-center mb-4">
            <img src="" alt="Logo" className="mb-3" />
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
              <Button
                variant="outline-secondary"
                className="w-100 mb-2"
                style={{ borderRadius: "20px", height: "45px" }}
              >
                <img src="" alt="Google Logo" className="me-2" />
                Continue with Google
              </Button>

              

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

              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Control
                    type="email"
                    placeholder="Email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ borderRadius: "20px", height: "60px" }}
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mt-3">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ borderRadius: "20px", height: "60px" }}
                  />
                </Form.Group>

                <div className="mt-3">
                  <a href="/forgot-password">Forgot Password?</a>
                </div>

                <div className="mt-3">
                  New to our community? <a href="/signup">Sign up</a>
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
  );
};

export default LoginForm;
