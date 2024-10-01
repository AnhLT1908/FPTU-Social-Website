import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // For navigation

const CreateUPForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);

  const navigate = useNavigate(); // React Router hook for navigation

  const handleLogin = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle login logic if form is valid
      console.log({ username, password });
    } else {
      setValidated(true); // Set validated state to true to show errors
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!username) {
      newErrors.username = "Username is required.";
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

  // Function to navigate back to the signup page
  const handleBack = () => {
    navigate("/register");
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
                
              {/* Back arrow */}
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

              <Form noValidate validated={validated} onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="username">
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
                  style={{
                    borderRadius: "20px",
                    height: "45px",
                    backgroundColor: "#ff5e00",
                  }}
                >
                  Continue
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
