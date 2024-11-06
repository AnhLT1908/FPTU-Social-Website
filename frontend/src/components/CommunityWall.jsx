import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Dropdown,
  ButtonGroup,
  Image,
  Modal,
  Form,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaArrowUp, FaArrowDown, FaComment, FaShare } from "react-icons/fa";
import ManageCommunity from "./ManageCommunity";
import { useNavigate, useParams, Link } from "react-router-dom";
import CreatePost from "./CreatePost";
import axios from "axios";

const CommunityPage = () => {
  const navigate = useNavigate();
  const [reportDes, setReportDes] = useState("");
  const [community, setCommunity] = useState(null);
  const [rule, setRule] = useState("");
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [communityName, setCommunityName] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [reportedPosts, setReportedPosts] = useState(new Set());
  const token = localStorage.getItem("token");
  const reportedPostsLocal = JSON.parse(
    localStorage.getItem("reportedPosts") || "{}"
  );
  const [postId, setPostId] = useState(null);
  const [joinReason, setJoinReason] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const communityId = id;
  console.log("Community id route:", communityId);

  console.log("reportedPostsLocal", reportedPostsLocal);

  const openReportModal = (id) => {
    setPostId(id);
    setShowModal1(true);
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
      setBookmarks(userData.bookmarks || []);
    }
    setReportedPosts(new Set(Object.keys(reportedPostsLocal)));
    fetchCommunity();
    fetchUser();
  }, [communityId]);

  useEffect(() => {
    fetch(`http://localhost:9999/api/v1/communities/get-post/${communityId}`)
      .then((res) => res.json())
      .then((data) => {
        // Sort posts from newest to oldest based on `createdAt`
        const sortedPosts = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts);
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, [communityId]);

  const fetchCommunity = () => {
    axios
      .get(`http://localhost:9999/api/v1/communities/${id}`)
      .then((response) => {
        setCommunity(response.data);
        setCommunityName(response.data.name);
        setDescription(response.data.description);
        setRule(response.data.communityRule);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchUser = () => {
    axios
      .get(`http://localhost:9999/api/v1/communities/get-user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const result = response.data?.map((item) => item.userId);
        setUsers(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

  const handleImageClick = (image) => {
    setModalImage(image);
    setShowModal(true);
  };

  const handleSave = (sid) => {
    if (!user.bookmarks?.includes(sid)) {
      user.bookmarks?.push(sid);
    }
    localStorage.setItem("user", JSON.stringify(user));
    const data = JSON.stringify({ bookmarks: user.bookmarks });

    axios
      .patch("http://localhost:9999/api/v1/users/update-me", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        alert("Save post success!");
        navigate(`/community/${id}`);
      })
      .catch((error) => {
        console.error("Lỗi khi gửi yêu cầu:", error);
      });
  };

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

  const handleJoin = () => {
    const joinData = JSON.stringify({
      userId: user.id,
      communityId: id,
      role: "member",
    });
    const config = {
      headers: { "Content-Type": "application/json" },
    };

    if (community?.privacyType === "public") {
      axios
        .post("http://localhost:9999/api/v1/communities/join", joinData, config)
        .then(() => {
          setShowModal2(false);
          alert("Joined community successfully!");
          navigate(`/community/${id}`);
        })
        .catch((error) => console.log(error));
    } else {
      const data = JSON.stringify({
        joinRequests: [{ userId: user.id, reason: joinReason }],
      });

      axios
        .patch(`http://localhost:9999/api/v1/communities/request/${id}`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          setShowModal2(false);
          alert("Your request has been sent to the moderator!");
          navigate(`/community/${id}`);
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        {/* Main Content */}
        <Col md={8}>
          <Card className="mb-4 p-4">
            <div className="d-flex align-items-center mb-3">
              <h1 className="ml-3">f/{communityName}</h1>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              {user?.moderatorCommunities?.includes(id) ? (
                <Button variant="light" onClick={() => setShowModal(true)}>
                  Manage Comunity
                </Button>
              ) : (
                <ButtonGroup aria-label="Basic example">
                  {!users?.includes(user?.id) ? (
                    community?.joinRequests?.some(
                      (request) => request.userId === user.id
                    ) ? (
                      <Button variant="secondary" aria-readonly>
                        Process
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={() => setShowModal2(true)}
                      >
                        Join
                      </Button>
                    )
                  ) : (
                    <>
                      <Button
                        variant="warning"
                        onClick={() => setShowCreatePost(true)}
                      >
                        Create Post
                      </Button>
                      <Button variant="success" aria-readonly>
                        Joined
                      </Button>
                    </>
                  )}
                </ButtonGroup>
              )}
            </div>
          </Card>
          <ManageCommunity
            showModal={showModal}
            setShowModal={setShowModal}
            community={community}
          ></ManageCommunity>
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
          <Modal show={showModal2} onHide={() => setShowModal2(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Join Request</Modal.Title>
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
                    placeholder="Enter reason"
                    value={joinReason}
                    onChange={(e) => setJoinReason(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal2(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={() => handleJoin()}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>

          {showCreatePost && <CreatePost communityData={community} />}

          {posts?.map((post, index) => (
            <Card key={post._id} className="mb-3 p-3">
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
                    <Dropdown.Toggle variant="light">Settings</Dropdown.Toggle>
                    <Dropdown.Menu>
                      {reportedPosts.has(post.id) ? (
                        <Dropdown.Item
                          onClick={() => handleUndoReport(post.id)}
                        >
                          Undo
                        </Dropdown.Item>
                      ) : (
                        <Dropdown.Item onClick={() => setShowModal1(true)}>
                          Report
                        </Dropdown.Item>
                      )}
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
          ))}
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

        {/* Sidebar */}
        <Col md={4}>
          <Card
            className="mb-4 p-3"
            style={{ height: "85vh", overflowY: "auto" }}
          >
            <h4>{community?.name}</h4>
            <p>
              {community?.description === ""
                ? "This community don't have description"
                : community?.description}
            </p>

            <hr />
            <p>
              <strong>Created</strong>{" "}
              {new Date(community?.createdAt).toLocaleString()}
            </p>
            <p>{community?.privacyType}</p>
            <hr />
            <div className="d-flex justify-content-between">
              <p>
                <strong>{community?.memberCount}</strong> Members
              </p>
            </div>
            <hr />

            <h5>Rules</h5>
            <ul>
              {community?.communityRule.split(".").map((item, index) => (
                <li key={index}>{item.trim()}</li> // Sử dụng trim() để loại bỏ khoảng trắng ở đầu/cuối
              ))}
            </ul>

            <hr />
            <h5>Moderators</h5>
            <ul>
              <li>u/faeriefire</li>
              <li>u/omni42</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CommunityPage;
