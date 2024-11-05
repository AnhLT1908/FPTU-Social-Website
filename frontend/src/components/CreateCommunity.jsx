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
  const [banner, setBanner] = useState("");
  const [icon, setIcon] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [communityType, setCommunityType] = useState("public");
  const [isMature, setIsMature] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [rule, setRule] = useState("");
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

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

  const handleSubmit = async () => {
    const data = JSON.stringify({
      name: communityName,
      description: description,
      createdBy: "67138908290ef9092c172bbf", // replace with actual user ID
      moderators: ["67138908290ef9092c172bbf"], // replace with actual moderator IDs
      logo: icon,
      background: banner,
      privacyType: communityType,
      communityRule: rule,
      topics: selectedTopics,
    });

    try {
      const response = await axios.post(
        "http://localhost:9999/api/v1/communities",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Community successfully created:", response.data);
      setShowPreview(false);
      navigate("/");
    } catch (error) {
      console.error("Error creating community:", error);
      console.log("data:", data);
      setError("Failed to create community. Please try again.");
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
      rule={rule}
      setRule={setRule}
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
  const handleClose = () => {
    setShowPreview(false);
    window.location.href = "/";
  };
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
            onClick={() => navigate("/")}
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
          <Button variant="secondary" onClick={() => handleClose()}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create Community
          </Button>
        </Modal.Footer>
      </Modal>

      {error && <p className="text-danger text-center mt-3">{error}</p>}

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
