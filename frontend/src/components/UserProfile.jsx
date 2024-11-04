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
  const [posts, setPosts] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("new");
  const token = localStorage.getItem("token");

  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) setUser(userData);

    const fetchPosts = () => {
      fetch(`http://localhost:9999/api/v1/posts/my-feed?sort=${filter}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Post:", data);
          const postsWithReactions = data.feed.map((item) => ({
            ...item,
            upVotes: item.upVotes || 0,
            downVotes: item.downVotes || 0,
            upVoted: false,
            downVoted: false,
          }));
          setPosts(postsWithReactions);
        })
        .catch((error) => console.error("Error fetching posts:", error));
    };

    fetchPosts();
  }, [filter, token]);

  const handleReaction = (postIndex, type) => {
    setPosts((prevPosts) => {
      const updatedPosts = [...prevPosts];
      const post = updatedPosts[postIndex];

      if (type === "upVote") {
        post.upVoted ? post.upVotes-- : post.upVotes++;
        if (post.downVoted) {
          post.downVotes--;
          post.downVoted = false;
        }
        post.upVoted = !post.upVoted;
      } else {
        post.downVoted ? post.downVotes-- : post.downVotes++;
        if (post.upVoted) {
          post.upVotes--;
          post.upVoted = false;
        }
        post.downVoted = !post.downVoted;
      }

      return updatedPosts;
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

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
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
                    <h4>{user?.username || "Username"}</h4>
                    <p style={{ fontWeight: "bold", color: "#666666" }}>
                      u/{user?.username || "Username"}
                    </p>
                  </div>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col md={12}>
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
                  <Link to={`/profile/${user._id}/saved`}>
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
                  <div>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="light"
                        style={{ borderRadius: "18px" }}
                      >
                        New
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => handleFilterChange("new")}
                        >
                          New
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleFilterChange("hot")}
                        >
                          Hot
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {posts.map((post, index) => (
            <Card key={index} className="mt-3 p-3">
              <Row>
                <Col>
                  <Link to={`/community/${post.communityId}`}>
                    <p>
                      <strong>
                        {"f/" + post.communityId?.name || "Community Name"}
                      </strong>{" "}
                      • {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </Link>
                  <p className="mt-n2">
                    {"u/" + post.userId?.username || "Username"}
                  </p>
                </Col>
                <Col className="d-flex justify-content-end">
                  <Dropdown>
                    <Dropdown.Toggle variant="light">Settings</Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>Save</Dropdown.Item>
                      <Dropdown.Item>Report</Dropdown.Item>
                      <Dropdown.Item>Hide</Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => navigate(`/edit-post/${post.id}`)}
                      >
                        Edit
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>

              <Row>
                <Col md={8}>
                  <Link to={`/post/${post.id}`}>
                    <h2>{post.title}</h2>
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
                  variant={post.upVoted ? "success" : "light"}
                  onClick={() => handleReaction(index, "upVote")}
                >
                  <FaArrowUp />
                </Button>
                <span className="mx-2">{post.upVotes}</span>
                <Button
                  variant={post.downVoted ? "danger" : "light"}
                  onClick={() => handleReaction(index, "downVote")}
                >
                  <FaArrowDown />
                </Button>
                <span className="mx-2">{post.downVotes}</span>
                <Button variant="light">
                  <FaComment /> {post.comments || 0}
                </Button>
              </div>
            </Card>
          ))}
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
                      <h5>{user?.username || "Username"}</h5>
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
