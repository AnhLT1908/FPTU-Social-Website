import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  Col,
  Container,
  Form,
  FormCheck,
  FormControl,
  FormGroup,
  FormLabel,
  FormSelect,
  FormText,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Row,
} from "react-bootstrap";

import background from "../images/postImage/background.png";
import { FaUser, FaPen } from "react-icons/fa";

const SettingProfile = () => {
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [password, setPassword] = useState("123456789");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const handleSavePassword = () => {
    if (newPassword === confirmPassword) {
      setPassword(newPassword);
      handleClose2();
    } else {
      alert("Passwords do not match!");
    }
  };

  const districts = [
    "Ba Dinh",
    "Hoan Kiem",
    "Tay Ho",
    "Long Bien",
    "Cau Giay",
    "Dong Da",
    "Hai Ba Trung",
    "Hoang Mai",
    "Thanh Xuan",
    "Soc Son",
    "Dong Anh",
    "Gia Lam",
    "Nam Tu Liem",
    "Bac Tu Liem",
    "Me Linh",
    "Ha Dong",
    "Son Tay",
    "Ba Vi",
    "Phuc Tho",
    "Dan Phuong",
    "Hoai Duc",
    "Quoc Oai",
    "Thach That",
    "Chuong My",
    "Thanh Oai",
    "Thuong Tin",
    "Phu Xuyen",
    "Ung Hoa",
    "My Duc",
  ];

  return (
    <Container>
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
                        placeholder="AnhLTHE172031"
                        readOnly
                      />
                    </FormGroup>
                    <FormGroup className="mt-3" controlId="displayName">
                      <FormLabel>Display Name</FormLabel>
                      <FormControl type="text" value="vjppr0n01fu" />
                    </FormGroup>
                  </Form>
                  <Form>
                    <FormGroup
                      className="mt-3"
                      controlId="password"
                      onClick={handleShow2}
                    >
                      <FormLabel>Password</FormLabel>
                      <FormControl type="password" value={password} readOnly />
                    </FormGroup>
                  </Form>
                  <Form>
                    <FormGroup className="mt-3" controlId="email">
                      <FormLabel>Email</FormLabel>
                      <FormControl
                        type="email"
                        value="anhlthe172031@fpt.edu.vn"
                      ></FormControl>
                    </FormGroup>
                  </Form>
                  <Form>
                    <FormGroup className="mt-3" controlId="phone">
                      <FormLabel>Phone</FormLabel>
                      <FormControl type="text" value="0388316122"></FormControl>
                    </FormGroup>
                  </Form>
                  <Form>
                    <FormGroup className="mt-3" controlId="gender">
                      <FormLabel style={{ marginRight: "20px" }}>
                        Gender
                      </FormLabel>
                      <FormCheck
                        inline
                        type="radio"
                        label="Male"
                        name="gender"
                        checked
                      />
                      <FormCheck
                        inline
                        type="radio"
                        label="Female"
                        name="gender"
                      />
                      <FormCheck
                        inline
                        type="radio"
                        label="Other"
                        name="gender"
                      />
                    </FormGroup>
                  </Form>
                  <Form>
                    <FormGroup>
                      <FormLabel>Location</FormLabel>
                      <FormSelect>
                        {districts.map((district, index) => (
                          <option key={index} value={district}>
                            {district}, Hanoi
                          </option>
                        ))}
                      </FormSelect>
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
                  >
                    Save
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col md={3}>
              <Card>
                <CardImg src={background} variant="top" />
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
                <CardBody>
                  <Row>
                    <Col className="d-flex justify-content-center">
                      <FaUser
                        style={{
                          borderRadius: "100px",
                          width: "75px",
                          height: "75px",
                          backgroundColor: "#dddddd",
                          padding: "10px 10px",
                          color: "white",
                          marginTop: "-50px",
                        }}
                      />
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
                          <FormControl as="textarea"></FormControl>
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
              <FormControl type="file" />
              <FormText>Formats: JPG, PNG</FormText>
              <FormText style={{ float: "right" }}>Max size: 500 KB</FormText>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button className="btn" variant="secondary" onClick={handleClose1}>
            Cancel
          </Button>
          <Button className="btn" variant="primary" onClick={handleClose1}>
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
                value={password}
                readOnly
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
    </Container>
  );
};

export default SettingProfile;
