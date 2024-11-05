import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  Col,
  Container,
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  FormText,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Row,
  Image,
} from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import background from "../images/postImage/background.png";
import { FaUser, FaPen } from "react-icons/fa";

const SettingProfile = () => {
  const [userData, setUserData] = useState({});
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false); // New state for background modal
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedBackgroundFile, setSelectedBackgroundFile] = useState(null); // State for background file
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("user"));
    if (storedUserData) setUser(storedUserData);
  }, []);

  const handleSaveProfile = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:9999/api/v1/users/update-me`,
        {
          displayName: userData.displayName,
          email: userData.email,
          bio: userData.bio,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedUserData = response.data.user;
      setUserData(updatedUserData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile!");
    }
  };

  const handleImageUpload = async (file, type) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);
    try {
      const response = await axios.patch(
        "http://localhost:9999/api/v1/users/upload-image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUserData(response.data.user);
      toast.success("Image updated successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image.");
    }
  };

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await axios.patch(
        "http://localhost:9999/api/v1/users/change-password",
        { oldPassword: currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Password updated successfully!");
      handleClose2();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Current password is incorrect!");
      } else {
        toast.error("An error occurred while updating the password.");
      }
      console.error("Error updating password:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user._id) return;
      try {
        const response = await axios.get(
          `http://localhost:9999/api/v1/users/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token, user]);

  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);

  return (
    <Container>
      <ToastContainer /> {/* Add ToastContainer to your component */}
      <Row>
        <Col md={12}>
          <Row>
            <Col md={12}>
              <h1>Settings</h1>
            </Col>
          </Row>
          <Row>
            <Col md={9}>
              <Card>
                <CardBody>
                  <Form>
                    <FormGroup controlId="userName">
                      <FormLabel>User Name</FormLabel>
                      <FormControl
                        style={{ backgroundColor: "#dddddd" }}
                        type="text"
                        value={userData?.username || ""}
                        readOnly
                      />
                    </FormGroup>
                    <FormGroup className="mt-3" controlId="displayName">
                      <FormLabel>Display Name</FormLabel>
                      <FormControl
                        type="text"
                        value={userData?.displayName || ""}
                        placeholder="Set your display name here"
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            displayName: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                    <FormGroup className="mt-3" controlId="email">
                      <FormLabel>Email</FormLabel>
                      <FormControl
                        type="email"
                        value={userData?.email || ""}
                        onChange={(e) =>
                          setUserData({ ...userData, email: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup
                      className="mt-3"
                      controlId="password"
                      onClick={handleShow2}
                    >
                      <FormLabel>Password</FormLabel>
                      <FormControl
                        type="text"
                        placeholder="Click here to change your password"
                        readOnly
                      />
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
              <Row className="mt-3">
                <Col md={12}>
                  <Button
                    style={{ float: "right", marginLeft: "10px" }}
                    className="btn"
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    style={{ float: "right" }}
                    className="btn"
                    variant="success"
                    onClick={handleSaveProfile}
                  >
                    Save
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col md={3}>
              <Card>
                <CardImg src={userData?.background} style={{height: '150px', width: '100%', objectFit: 'cover'}} variant="top" />
                <Button
                  variant="secondary"
                  style={{
                    position: "relative",
                    marginTop: "-15px",
                    width: "30px",
                    height: "30px",
                    borderRadius: "100px",
                    marginLeft: "250px",
                  }}
                  onClick={handleShow3}
                >
                  <FaPen
                    style={{
                      padding: "1px",
                      marginLeft: "-5px",
                      marginTop: "-10px",
                    }}
                  />
                </Button>
                <CardBody>
                  <Row>
                    <Col className="d-flex justify-content-center">
                      <Image src={userData?.avatar } style={{
                          borderRadius: "100px",
                          width: "100px",
                          height: "100px",
                          padding: "10px 10px",
                          color: "white",
                          marginTop: "-65px",
                        }}/>
                      <Button
                        variant="secondary"
                        style={{
                          position: "absolute",
                          marginLeft: "50px",
                          width: "30px",
                          height: "30px",
                          borderRadius: "100px",
                        }}
                        onClick={handleShow1}
                      >
                        <FaPen
                          style={{
                            padding: "1px",
                            marginLeft: "-5px",
                            marginTop: "-10px",
                          }}
                        />
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form>
                        <FormGroup>
                          <FormLabel>Bio</FormLabel>
                          <FormControl
                            as="textarea"
                            value={userData?.bio || ""}
                            onChange={(e) =>
                              setUserData({ ...userData, bio: e.target.value })
                            }
                          ></FormControl>
                        </FormGroup>
                      </Form>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <Modal show={show1} onHide={handleClose1}>
        <ModalHeader closeButton>
          <ModalTitle>Change Image</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <FormControl
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
              <FormText>Formats: JPG, PNG</FormText>
              <FormText style={{ float: "right" }}>Max size: 500 KB</FormText>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button className="btn" variant="secondary" onClick={handleClose1}>
            Cancel
          </Button>
          <Button
            className="btn"
            variant="primary"
            onClick={() => {
              if (selectedFile) {
                handleImageUpload(selectedFile, "avatar");
                handleClose1();
              } else {
                toast.error("Please select a file first.");
              }
            }}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
      <Modal show={show2} onHide={handleClose2}>
        <ModalHeader closeButton>
          <ModalTitle>Change Password</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <FormControl
                className="mb-3"
                type="password"
                placeholder="Current password *"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <FormControl
                className="mb-3"
                type="password"
                placeholder="New password *"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <FormControl
                className="mb-3"
                type="password"
                placeholder="Confirm password *"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button className="btn" variant="secondary" onClick={handleClose2}>
            Cancel
          </Button>
          <Button
            className="btn"
            variant="primary"
            onClick={handleSavePassword}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
      <Modal show={show3} onHide={handleClose3}>
        <ModalHeader closeButton>
          <ModalTitle>Change Background Image</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <FormControl
                type="file"
                onChange={(e) => setSelectedBackgroundFile(e.target.files[0])}
              />
              <FormText>Formats: JPG, PNG</FormText>
              <FormText style={{ float: "right" }}>Max size: 500 KB</FormText>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={handleClose3}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (selectedBackgroundFile) {
                handleImageUpload(selectedBackgroundFile, "background");
                handleClose3();
              } else {
                toast.error("Please select a file first.");
              }
            }}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default SettingProfile;
