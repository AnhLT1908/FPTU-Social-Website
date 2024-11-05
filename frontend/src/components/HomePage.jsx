import React, { useEffect, useState } from "react";
import {
  Col,
  Container,
  Image,
  Row,
  Modal,
  Button,
  Card,
  Dropdown,
  Form,
} from "react-bootstrap";
import { FaArrowUp, FaArrowDown, FaComment, FaShare } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import img1 from "../images/postImage/images_postId1.jpg";
import img2 from "../images/postImage/images_postId2.jpg";
import img3 from "../images/postImage/images_postId3.jpg";
import img4 from "../images/postImage/images_postId4.jpg";
import img5 from "../images/postImage/images_postId5.jpg";
import img6 from "../images/postImage/images_postId6.jpg";
import img7 from "../images/postImage/images_postId7.jpg";
import img8 from "../images/postImage/images_postId8.jpg";
import img9 from "../images/postImage/images_postId9.jpg";
import img10 from "../images/postImage/images_postId10.jpg";
import axios from "axios";
const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [filter, setFilter] = useState("new");
  const token = localStorage.getItem("token");
  const [postId, setPostId] = useState(null);
  const [showModal1, setShowModal1] = useState(false);
  const [reportDes, setReportDes] = useState("");
  const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];
  const handleReportPost = (uid, pid) => {
    let data = JSON.stringify({
      userId: uid,
      reportEntityId: pid,
      entityType: "Post",
      description: reportDes,
      status: "Waiting",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:9999/api/v1/reports/",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        alert("Your report have send to admin success!!");
        setShowModal1(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
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

  const handleReaction = (index, type) => {
    setPosts((prevPosts) => {
      const updatedPosts = [...prevPosts];
      const post = updatedPosts[index];

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
  const openReportModal = (id) => {
    setPostId(id); // Lưu post._id vào state
    setShowModal1(true);
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
    <Container>
      <Modal show={showModal1} onHide={() => setShowModal1(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reports</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Block for Community Name */}
            <Form.Group controlId="report" className="mb-3">
              <Form.Label>
                Reason <span style={{ color: "red" }}></span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter report reason"
                value={reportDes}
                onChange={(e) => setReportDes(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal1(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => handleReportPost(user.id, postId)}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Row className="mt-2 mb-2">
        <Col md={12}>
          <Row className="mb-2">
            <Col>
              <Dropdown>
                <Dropdown.Toggle variant="light">
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleFilterChange("new")}>
                    New
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleFilterChange("hot")}>
                    Hot
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>

          {posts.map((post, index) => (
            <Card key={post._id} className="mb-3 p-3">
              <Row>
                <Col>
                  <Link to={`/community/${post?.communityId.id}`}>
                    <p>
                      <strong>
                        {"f/" + post.communityId.name || "Community Name"}
                      </strong>{" "}
                      • {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </Link>
                  <Link to={`/profile/${post.userId}`}>
                    <p className="mt-n2">
                      {"u/" + post.userId.username || "Username"}
                    </p>
                  </Link>
                </Col>
                <Col className="d-flex justify-content-end">
                  <Dropdown>
                    <Dropdown.Toggle variant="light">Settings</Dropdown.Toggle>
                    <Dropdown.Menu>
                      {post?.userId?.id === user?.id ? (
                        <Dropdown.Item
                          onClick={() => navigate(`/edit-post/${post?._id}`)}
                        >
                          Edit
                        </Dropdown.Item>
                      ) : (
                        <>
                          <Dropdown.Item onClick={() => handleSave(post?._id)}>
                            Save
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => openReportModal(post?._id)}
                          >
                            Report
                          </Dropdown.Item>
                        </>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>

              <Row>
                <Col md={8}>
                  <Link to={`/post/${post._id}`}>
                    <h2>{post.title}</h2>
                  </Link>
                </Col>
                <Col md={4}>
                  <Image
                    src={images[index % images.length]}
                    alt={`post-${index + 1}`}
                    fluid
                    style={{
                      width: "50%",
                      borderRadius: "10px",
                      cursor: "pointer",
                      float: "right",
                    }}
                    onClick={() =>
                      handleImageClick(images[index % images.length])
                    }
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
                  <FaComment /> {post.commentsCount || 0}
                </Button>
              </div>
            </Card>
          ))}

          {/*************************************************** */}
          <Row>
            <Col className="text-center">
              <h3>
                <a href="#" style={{ textDecoration: "none" }}>
                  No more content
                </a>
              </h3>
            </Col>
          </Row>
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

export default HomePage;
