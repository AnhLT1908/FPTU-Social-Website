import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true); // Set loading to true
      try {
        const response = await fetch("http://localhost:9999/api/v1/users/check-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          navigate("/create-username-password", { state: { email } });
        } else {
          const errorData = await response.json();
          setErrors({ form: errorData.message || "Registration failed. Please try again." });
        }
      } catch (error) {
        console.error("Error during registration:", error);
        setErrors({ form: "An error occurred. Please try again later." });
      } finally {
        setLoading(false); // Reset loading state
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[\w.%+-]+@fpt\.edu\.vn$/.test(email)) {
      newErrors.email = "Email must be in the format *@fpt.edu.vn.";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const details = jwtDecode(credentialResponse.credential);
      const email = details.email;
  
      // Kiểm tra nếu email không có đuôi @fpt.edu.vn thì không cho phép tiếp tục
      if (!email.endsWith("@fpt.edu.vn")) {
        setErrors({ form: "Only FPT emails are allowed." });
        return;
      }
  
      // Gửi yêu cầu kiểm tra email lên server
      const response = await fetch("http://localhost:9999/api/v1/users/check-email-for-google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          // Nếu tài khoản đã tồn tại, thực hiện đăng nhập tự động
          fetch("http://localhost:9999/api/v1/users/google-login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: credentialResponse.credential }),
          })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "success") {
              console.log("Google login successful", data.user);
              localStorage.setItem("token", data.token);
              localStorage.setItem("user", JSON.stringify(data.user));
              navigate("/");
            } else {
              console.error("Google login failed", data.message);
            }
        })
          .catch((error) => {
            console.error("Error during Google login", error);
          });
        } else {
          // Nếu chưa có tài khoản, chuyển hướng đến trang tạo username và password
          navigate("/create-username-password", { state: { email } });
        }
      } else {
        console.error("Error checking email:", response.statusText);
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
      setErrors({ form: "An error occurred during Google Sign-In. Please try again later." });
    }
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
              <a href="/">
                <img src="../images/logo.jpg" href="/" alt="Logo" className="mb-3" style={{ width: "100px" }}/>
              </a>
              <h1>FPTU Social Website</h1>
              <p>The Internet Home Place, where many communities reside</p>
            </div>

            <Card className="p-4 shadow-sm" style={{ width: "500px" }}>
              <Card.Body>
                <h2 className="fw-bold">Sign Up</h2>
                <h6 className="mb-4 fw-normal">
                  By continuing, you agree to our User Agreement and acknowledge
                  that you understand the Privacy Policy
                </h6>

                {/* <div className="mb-2">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap
                  />
                </div>

                <div className="d-flex align-items-center my-2">
                  <div className="flex-grow-1 bg-secondary" style={{ height: "1px" }}></div>
                  <span className="mx-4 text-muted">OR</span>
                  <div className="flex-grow-1 bg-secondary" style={{ height: "1px" }}></div>
                </div> */}

                <Form noValidate onSubmit={handleRegister}>
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

                  {errors.form && (
                    <div className="text-danger mt-3">{errors.form}</div>
                  )}

                  <div className="mt-3">
                    Already a member?{" "}
                    <a href="/login" style={{ textDecoration: "none", color: "#0086c9" }}>
                      Log in
                    </a>
                  </div>

                  <Button
                    type="submit"
                    className="mt-4 w-100"
                    disabled={loading} // Disable button while loading
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
    </GoogleOAuthProvider>
  );
};

export default RegisterForm;
