import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Dropdown,
  Modal,
  Image,
  CardImg,
} from "react-bootstrap";
import {
  FaUser,
  FaPlus,
  FaShare,
  FaArrowUp,
  FaArrowDown,
  FaComment,
} from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";
import background from "../images/postImage/background.png";
import image1 from "../images/postImage/images_postId1.jpg";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [postDetail, setPostDetail] = useState({
    id: "",
    title: "",
    body: "",
    reactions: {
      likes: 0,
      dislikes: 0,
    },
    comments: 0,
    timeCreate: "",
    userName: "",
    communityName: "",
    liked: false,
    disliked: false,
  });
  const [modalImage, setModalImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:9999/post/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPostDetail({
          ...data,
          liked: false,
          disliked: false,
        });
      })
      .catch((error) => console.log(error));
  }, [id]);

  const handleLike = () => {
    setPostDetail((prevPost) => {
      const newLikes = prevPost.liked
        ? prevPost.reactions.likes - 1
        : prevPost.reactions.likes + 1;
      const newDislikes = prevPost.disliked
        ? prevPost.reactions.dislikes - 1
        : prevPost.reactions.dislikes;

      return {
        ...prevPost,
        reactions: {
          ...prevPost.reactions,
          likes: newLikes,
          dislikes: newDislikes,
        },
        liked: !prevPost.liked,
        disliked: prevPost.disliked ? false : prevPost.disliked,
      };
    });
  };

  const handleDislike = () => {
    setPostDetail((prevPost) => {
      const newDislikes = prevPost.disliked
        ? prevPost.reactions.dislikes - 1
        : prevPost.reactions.dislikes + 1;
      const newLikes = prevPost.liked
        ? prevPost.reactions.likes - 1
        : prevPost.reactions.likes;

      return {
        ...prevPost,
        reactions: {
          ...prevPost.reactions,
          dislikes: newDislikes,
          likes: newLikes,
        },
        disliked: !prevPost.disliked,
        liked: prevPost.liked ? false : prevPost.liked,
      };
    });
  };

  const handleImageClick = (image) => {
    setModalImage(image);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalImage(null);
  };

  return (
    <Container fluid>
      <Row>
        <Col md={8}>
          <Card>
            <CardBody>
              <Row>
                <Col md={12} className="d-flex align-items-center">
                  <div style={{ marginRight: "30px" }}>
                    <FaUser
                      style={{
                        borderRadius: "100px",
                        width: "100px",
                        height: "100px",
                        backgroundColor: "#f3752c",
                        padding: "10px 10px",
                        color: "white",
                      }}
                    />
                    <Button
                      className="btn d-flex justify-content-center align-items-center"
                      variant="secondary"
                      style={{
                        borderRadius: "100px",
                        width: "30px",
                        height: "30px",
                        padding: "5px 5px",
                        marginTop: "-30px",
                        marginLeft: "70px",
                        position: "relative",
                      }}
                    >
                      <Link
                        to={`/setting`}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <FaPlus style={{ color: "white" }} />
                      </Link>
                    </Button>
                  </div>
                  <div>
                    <h4>AnhLTHE172031</h4>
                    <p style={{ fontWeight: "bold", color: "#666666" }}>
                      u/AnhLTHE172031
                    </p>
                  </div>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col md={12}>
                  <Link>
                    <Button
                      className="btn"
                      variant="light"
                      style={{
                        backgroundColor:
                          activeTab === "overview" ? "#c9d7de" : "#ffffff",
                        border: "none",
                        borderRadius: "30px",
                      }}
                      onClick={() => setActiveTab("overview")}
                    >
                      <h6 style={{ marginTop: "5px" }}>Overview</h6>
                    </Button>
                  </Link>
                  <Link to={`/profile/${postDetail.id}/posts`}>
                    <Button
                      className="btn"
                      variant="light"
                      style={{
                        border: "none",
                        borderRadius: "30px",
                      }}
                      onClick={() => setActiveTab("posts")}
                    >
                      <h6 style={{ marginTop: "5px" }}>Posts</h6>
                    </Button>
                  </Link>
                  <Link to={`/profile/${postDetail.id}/saved`}>
                    <Button
                      className="btn"
                      variant="light"
                      style={{
                        border: "none",
                        borderRadius: "30px",
                      }}
                      onClick={() => setActiveTab("saved")}
                    >
                      <h6 style={{ marginTop: "5px" }}>Saved</h6>
                    </Button>
                  </Link>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md={12} className="d-flex">
                  <Button
                    className="btn"
                    variant="light"
                    style={{
                      borderRadius: "18px",
                      border: "1px solid black",
                      fontWeight: "bold",
                      marginRight: "5px",
                    }}
                    onClick={() => navigate("/create-post")}
                  >
                    Create Post
                  </Button>
                  <div>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="light"
                        style={{ borderRadius: "18px" }}
                      >
                        New
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item>Hot</Dropdown.Item>
                        <Dropdown.Item>New</Dropdown.Item>
                        <Dropdown.Item>Top</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Card key={postDetail.id} className="mt-3 p-3">
            <Row>
              <Col>
                <Link to={"/community/2"}>
                  <p>
                    <strong>{postDetail.communityName}</strong> •{" "}
                    {postDetail.timeCreate}
                  </p>
                </Link>
                <p className="mt-n2">{postDetail.userName}</p>
              </Col>
              <Col className="d-flex justify-content-end">
                <Dropdown>
                  <Dropdown.Toggle variant="light">Settings</Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>Save</Dropdown.Item>
                    <Dropdown.Item>Report</Dropdown.Item>
                    <Dropdown.Item>Hide</Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate("/edit-post/2")}>
                      Edit
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Link to={`/post/${postDetail.id}`}>
                  <h2>{postDetail.title}</h2>
                </Link>
              </Col>
              <Col md={4}>
                <Image
                  src={image1}
                  alt=""
                  fluid
                  style={{
                    width: "75%",
                    borderRadius: "10px",
                    cursor: "pointer",
                    float: "right",
                  }}
                  onClick={() => handleImageClick(image1)}
                />
              </Col>
            </Row>

            <div className="d-flex align-items-center">
              <Button
                variant={postDetail.liked ? "success" : "light"}
                onClick={() => handleLike(postDetail.id)}
              >
                <FaArrowUp />
              </Button>
              <span className="mx-2">{postDetail.reactions.likes}</span>
              <Button
                variant={postDetail.disliked ? "danger" : "light"}
                onClick={() => handleDislike(postDetail.id)}
              >
                <FaArrowDown />
              </Button>
              <span className="mx-2">{postDetail.reactions.dislikes}</span>
              <Button variant="light">
                <FaComment /> {postDetail.comments}
              </Button>
              <Button variant="light">
                <FaShare /> Share
              </Button>
            </div>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <CardImg variant="top" src={background} />
            <CardBody>
              <Row>
                <Col md={12}>
                  <Button
                    className="btn d-flex justify-content-center align-items-center"
                    variant="secondary"
                    style={{
                      borderRadius: "100px",
                      width: "30px",
                      height: "30px",
                      padding: "5px 5px",
                      marginTop: "-30px",
                      float: "right",
                      position: "relative",
                    }}
                  >
                    <Link
                      to={`/setting`}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <FaPlus style={{ color: "white" }} />
                    </Link>
                  </Button>
                  <Row>
                    <Col md={12}>
                      <h5>AnhLTHE172031</h5>
                      <Button
                        variant="light"
                        style={{
                          backgroundColor: "#c9d7de",
                          borderRadius: "30px",
                          marginTop: "5px",
                        }}
                      >
                        <FaShare /> Share
                      </Button>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col md={12}>
                      <h5>Setting</h5>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col md={12} className="d-flex align-items-center">
                      <FaUser
                        style={{
                          borderRadius: "100px",
                          width: "40px",
                          height: "40px",
                          backgroundColor: "#f3752c",
                          padding: "5px 5px",
                          color: "white",
                          marginRight: "10px",
                        }}
                      />
                      <div>
                        <p style={{ fontSize: "14px", marginBottom: "0px" }}>
                          AnhLTHE172031
                        </p>
                        <p
                          style={{
                            color: "#666666",
                            fontSize: "14px",
                            marginBottom: "0px",
                          }}
                        >
                          Customize your profile
                        </p>
                      </div>
                      <div style={{ marginLeft: "140px" }}>
                        <Button
                          variant="light"
                          className="btn"
                          style={{
                            backgroundColor: "#c9d7de",
                            borderRadius: "30px",
                          }}
                        >
                          <Link to={`/setting`}>
                            <h6 style={{ marginTop: "5px" }}>Go to setting</h6>
                          </Link>
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Body>
          <Image src={modalImage} style={{ width: "100%" }} fluid />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserProfile;
