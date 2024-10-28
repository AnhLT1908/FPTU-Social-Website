import React, { useState } from "react";
import { Container, Row, Col, Button, Image, Modal } from "react-bootstrap";
import CommunityDetails from "./SubCMPNTCreateCommunity/CommunityDetails";
import CommunityStyle from "./SubCMPNTCreateCommunity/CommunityStyle";
import CommunityTopics from "./SubCMPNTCreateCommunity/CommunityTopics";
import CommunityType from "./SubCMPNTCreateCommunity/CommunityType";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const CreateCommunity = () => {
  const navigate = useNavigate();
  const [communityName, setCommunityName] = useState("");
  const [description, setDescription] = useState("");
  const [banner, setBanner] = useState(null);
  const [icon, setIcon] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [communityType, setCommunityType] = useState("Public");
  const [isMature, setIsMature] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowPreview(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const handleSubmit = () => {
    try {
      alert("Community successfully created!");
      setShowPreview(false);
      navigate("/");

      let data = JSON.stringify({
        name: communityName,
        description: description,
        createdBy: "67138908290ef9092c172bbf",
        moderators: "67138908290ef9092c172bbf",
        logo: icon,
        background: banner,
        privacyType: communityType,
        communityRule: "rule",
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:5173/api/v1/communities",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTM4OTA4MjkwZWY5MDkyYzE3MmJiZiIsImlhdCI6MTczMDAxMjUzOSwiZXhwIjoxNzM3Nzg4NTM5fQ.pAk1_n2rHpiWjLyjwuCa371E6XamMP2aaR6RLO60ChU",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "banner") setBanner(URL.createObjectURL(file));
      if (type === "icon") setIcon(URL.createObjectURL(file));
    }
  };

  const topicsList = [
    "Anime & Cosplay",
    "Anime & Manga",
    "Cosplay",
    "Art",
    "Performing Arts",
    "Architecture",
    "Design",
    "Filmmaking",
    "Photography",
  ];

  const steps = [
    <CommunityDetails
      communityName={communityName}
      setCommunityName={setCommunityName}
      description={description}
      setDescription={setDescription}
    />,
    <CommunityStyle
      banner={banner}
      setBanner={setBanner}
      icon={icon}
      setIcon={setIcon}
      handleImageUpload={handleImageUpload}
    />,

    <CommunityType
      communityType={communityType}
      setCommunityType={setCommunityType}
      isMature={isMature}
      setIsMature={setIsMature}
    />,
  ];

  return (
    <Container
      className="mt-5 bg-white mb-5"
      style={{
        maxWidth: "800px",
        boxShadow: "0 4px 8px grey",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <Row>
        <Col md={1}></Col>
        <Col md={11} className="d-flex justify-content-end align-items-center">
          <Button
            variant="light"
            className="me-3"
            onClick={() => alert("Community creation canceled")}
          >
            X
          </Button>
        </Col>
      </Row>
      <header>
        <h1 className="mb-4 d-flex justify-content-center align-items-center ">
          Create Community
        </h1>
      </header>
      <Row>
        <Col md={1}></Col>
        <Col md={10}>{steps[currentStep]}</Col>
      </Row>

      {/* Button to open the modal */}

      {/* Modal for preview */}
      <Modal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Community Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center mb-3">
            {icon && (
              <Image
                src={icon}
                alt="Icon"
                className="me-3"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                }}
              />
            )}
            <h5>{communityName || "Community Name"}</h5>
          </div>
          {banner && (
            <Image
              src={banner}
              alt="Banner"
              className="w-100 mb-3"
              style={{ height: "200px", objectFit: "cover" }}
            />
          )}
          <p>{description || "Community description goes here..."}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create Community
          </Button>
        </Modal.Footer>
      </Modal>
      <Container>
        <Row>
          <Col md={1}></Col>
          <Col md={10}>
            <Row>
              <Col>
                <Button
                  variant="secondary"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  Back
                </Button>
              </Col>
              <Col className="text-end">
                <Button variant="primary" onClick={handleNext}>
                  {currentStep === steps.length - 1
                    ? "Preview Community"
                    : "Next"}
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default CreateCommunity;
