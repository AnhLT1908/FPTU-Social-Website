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
import { doVotePost } from "../services/PostService";
import axios from "axios";
import { getHeader } from "../services/api";

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
  const [reportedPosts, setReportedPosts] = useState({});

  const handleReportPost = (uid, pid) => {
    const data = JSON.stringify({
      userId: uid,
      reportEntityId: pid,
      entityType: "Post",
      description: reportDes,
      status: "Waiting",
    });

    const config = {
      method: "post",
      url: "http://localhost:9999/api/v1/reports/",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };

    axios
      .request(config)
      .then(() => {
        alert("Your report has been sent to the admin successfully!");
        setShowModal1(false);
        setReportedPosts((prev) => ({ ...prev, [pid]: true }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUndoReport = (pid) => {
    const config = {
      method: "delete",
      url: `http://localhost:9999/api/v1/reports/by-entity/${pid}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then(() => {
        alert("Your report has been undone!");
        setReportedPosts((prev) => {
          const updated = { ...prev };
          delete updated[pid];
          return updated;
        });
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          alert(
            "No report found with this ID. It may have already been deleted."
          );
        } else {
          console.log(error);
        }
      });
  };

  useEffect(() => {
    fetchMe();
    const savedReportedPosts = JSON.parse(
      localStorage.getItem("reportedPosts")
    );
    if (savedReportedPosts) {
      setReportedPosts(savedReportedPosts);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("reportedPosts", JSON.stringify(reportedPosts));
  }, [reportedPosts]);

  useEffect(() => {
    const fetchPosts = () => {
      fetch(
        `http://localhost:9999/api/v1/posts/my-feed?sort=${filter}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("Post:", data);
          setPosts(data.feed);
        })
        .catch((error) => console.error("Error fetching posts:", error));
    };

    fetchPosts();
  }, [filter, token]);

  const fetchMe = async () => {
    const res = await axios.get("http://localhost:9999/api/v1/users/me", {
      headers: getHeader(),
    });
    if (res.data) {
      setUser(res.data);
      console.log("Set User", res.data);
    }
  };

  console.log("token", token);

  const handleVote = async (postId, vote) => {
    // Handle the vote up logic
    const res = await doVotePost(postId, vote);
    // Update the commentList state with the new vote information
    setPosts((prevList) =>
      prevList.map((post) => {
        if (post._id === postId) {
          // Create a new votes object based on the current votes
          const updatedVotes = { ...post.votes };

          // Update the votes based on the action
          if (vote === true) {
            updatedVotes[user.id] = true; // User voted up
          } else if (vote === false) {
            updatedVotes[user.id] = false; // User voted down
          } else {
            delete updatedVotes[user.id]; // User removed their vote
          }

          // Return the updated comment object
          return { ...post, votes: updatedVotes };
        }
        return post; // Return the comment unchanged if it doesn't match
      })
    );
  };
  const handleSave = (id) => {
    const data = JSON.stringify({
      bookmarks: [...user.bookmarks, id],
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

  console.log("Posts", posts);

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

          {posts && posts.length > 0 ? (
            posts.map((post, index) => (
              <Card key={post?._id} className="mb-3 p-3">
                <Row>
                  <Col>
                    <Link to={`/community/${post?.communityId?._id}`}>
                      <p>
                        <strong>
                          {"f/" + post.communityId?.name || "Community Name"}
                        </strong>{" "}
                        • {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </Link>
                    <Link to={`/profile/${post.userId}`}>
                      <p className="mt-n2">
                        {"u/" + post.userId?.username || "Username"}
                      </p>
                    </Link>
                  </Col>
                  <Col className="d-flex justify-content-end">
                    <Dropdown>
                      <Dropdown.Toggle variant="light">
                        Settings
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {post?.userId?.id === user?.id ? (
                          <Dropdown.Item
                            onClick={() => navigate(`/edit-post/${post?._id}`)}
                          >
                            Edit
                          </Dropdown.Item>
                        ) : reportedPosts[post._id] ? (
                          <div>
                            <Dropdown.Item
                              onClick={() => handleUndoReport(post._id)}
                            >
                              Undo
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => handleSave(post?._id)}
                            >
                              Save
                            </Dropdown.Item>
                          </div>
                        ) : (
                          <div>
                            <Dropdown.Item
                              onClick={() => openReportModal(post._id)}
                            >
                              Report
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => handleSave(post?._id)}
                            >
                              Save
                            </Dropdown.Item>
                          </div>
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
                    variant={
                      post.votes && post.votes[user.id] === true
                        ? "success"
                        : "light"
                    }
                    onClick={() =>
                      post.votes && post.votes[user.id] === true
                        ? handleVote(post._id, "none")
                        : handleVote(post._id, true)
                    }
                    aria-label="Vote Up"
                  >
                    <FaArrowUp />
                    {
                      Object.values(post.votes || {}).filter(
                        (vote) => vote === true
                      ).length
                    }
                  </Button>
                  <span className="mx-2"></span>
                  <Button
                    variant={
                      post.votes && post.votes[user.id] === false
                        ? "danger"
                        : "light"
                    }
                    onClick={() =>
                      post.votes && post.votes[user.id] === false
                        ? handleVote(post._id, "none")
                        : handleVote(post._id, false)
                    }
                    aria-label="Vote Down"
                  >
                    <FaArrowDown />
                    {
                      Object.values(post.votes || {}).filter(
                        (vote) => vote === false
                      ).length
                    }
                  </Button>
                  <span className="mx-2"></span>
                  <Link to={`/post/${post._id}`}>
                    <Button variant="light">
                      <FaComment /> {post.commentsCount || 0}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))
          ) : (
            <Row>
              <Col className="text-center">
                <div></div>
              </Col>
            </Row>
          )}

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
