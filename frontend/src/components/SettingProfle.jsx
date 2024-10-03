import React from "react";
import {
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
  Row,
} from "react-bootstrap";

import background from "../images/postImage/background.png";
import { FaUser } from "react-icons/fa";

const SettingProfile = () => {
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
                    <FormGroup className="mt-3" controlId="password">
                      <FormLabel>Password</FormLabel>
                      <FormControl type="password" value="123456789" />
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
            </Col>
            <Col md={3}>
              <Card>
                <CardImg src={background} variant="top"/>
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
    </Container>
  );
};

export default SettingProfile;
