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
import axios from "axios";
import image1 from "../images/postImage/images_postId1.jpg";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [posts, setPosts] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("new");
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("user"));
    console.log("storedUserData", storedUserData);
    if (storedUserData) {
      setUser(storedUserData);
    }
  }, []);

  const userId = user?.id;
  console.log("userId", userId);

  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:9999/api/v1/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("User data res:", response.data);
          const bookmarks = response.data.bookmarks || [];
          setPosts(
            bookmarks.map((b) => ({
              id: b.id,
              title: b.title,
              content: b.content,
              commentCount: b.commentCount,
              communityId: b.communityId,
              media: b.media,
              createdAt: b.createdAt,
              userId: b.userId,
              votes: b.votes,
            }))
          );
          setUserData(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [token, userId]);

  const handleSave = (id) => {
    const data = JSON.stringify({
      bookmarks: [id],
    });

    const config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: "http://localhost:9999/api/v1/users/update-me",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        alert("Save post success!");
        console.log("Phản hồi từ server:", response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi gửi yêu cầu:", error);
      });
  };

  const userDataGet = userData;
  console.log("userDataGet", userDataGet);
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
          <Card className="mb-4">
            <CardBody>
              <Row>
                <Col md={12} className="d-flex align-items-center">
                  <div style={{ marginRight: "30px" }}>
                    <Image
                      src={
                        userData?.avatar === "default.jpg"
                          ? "/images/logo.jpg"
                          : userData?.avatar
                      }
                      style={{
                        borderRadius: "100px",
                        width: "100px",
                        height: "100px",
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
                    <h4>
                      {userData?.displayName || "u/" + userData?.username}
                    </h4>
                    <p style={{ fontWeight: "bold", color: "#666666" }}>
                      u/{userData?.username || "Username"}
                    </p>
                  </div>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col md={12}>
                  <Link to={`/profile/${userData?._id}`}>
                    <Button
                      className="btn"
                      variant="light"
                      style={{
                        border: "none",
                        borderRadius: "30px",
                      }}
                      onClick={() => setActiveTab("overview")}
                    >
                      <h6 style={{ marginTop: "5px", color: "black" }}>
                        Overview
                      </h6>
                    </Button>
                  </Link>

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
                </Col>
              </Row>
              {/* <Row className="mt-2">
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
                        <Dropdown.Item>Hot</Dropdown.Item>
                        <Dropdown.Item>New</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Col>
              </Row> */}
            </CardBody>
          </Card>

          {!posts || posts.length === 0 ? (
            <h4>Looks like you haven't saved anything yet</h4>
          ) : (
            posts.map((post, index) => (
              <Card key={post.id} className="mb-3 p-3">
                <Row>
                  <Col>
                    <Link to={`/community/${post.communityId.id}`}>
                      <p>
                        <strong>
                          {"f/" + (post?.communityId?.name || "Community Name")}
                        </strong>{" "}
                        • {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </Link>
                    <Link to={`/profile/${post?.userId?.id}`}>
                      <p className="mt-n2">
                        {"u/" + (post?.userId?.username || "Username")}
                      </p>
                    </Link>
                  </Col>
                  <Col className="d-flex justify-content-end">
                    <Dropdown>
                      <Dropdown.Toggle variant="light">
                        Settings
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item>Report</Dropdown.Item>

                        <Dropdown.Item onClick={() => handleSave(post.id)}>
                          Save
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Row>

                <Row>
                  <Col md={8}>
                    <Link to={`/post/${post?._id}`}>
                      <h2>{post?.title}</h2>
                    </Link>
                  </Col>
                  <Col md={4}>
                    {post?.media && post.media.length > 0 && post.media[0] ? (
                      <Image
                        src={post.media[0]}
                        alt=""
                        fluid
                        style={{
                          width: "100%",
                          height: "200px",
                          borderRadius: "10px",
                          cursor: "pointer",
                          float: "right",
                          objectFit: "cover",
                        }}
                        onClick={() => handleImageClick(post.media[0])}
                      />
                    ) : (
                      <div></div>
                    )}
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
                  <span className="mx-2">{post?.downVotes}</span>
                  <Button
                    variant="light"
                    onClick={() => navigate(`/post/${post?._id}`)}
                  >
                    <FaComment /> {post.commentCount || 0}
                  </Button>
                </div>
              </Card>
            ))
          )}
        </Col>

        <Col md={4}>
          <Card>
            <CardImg
              variant="top"
              src={
                userData?.background === "default.jpg"
                  ? "/images/background.jpg"
                  : userData?.background
              }
              style={{ height: "250px", width: "100%", objectFit: "cover" }}
            />
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
                      <h5>
                        {userData?.displayName || "u/" + userData?.username}
                      </h5>
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
                      <Image
                        src={
                          userData?.avatar === "default.jpg"
                            ? "/images/logo.jpg"
                            : userData?.avatar
                        }
                        style={{
                          borderRadius: "100px",
                          width: "40px",
                          height: "40px",
                          marginRight: "10px",
                        }}
                      />
                      <div>
                        <p style={{ fontSize: "14px", marginBottom: "0px" }}>
                          u/{userData?.username}
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
