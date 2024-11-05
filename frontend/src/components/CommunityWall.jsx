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
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";

import axios from "axios";
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

const CommunityPage = () => {
  const navigate = useNavigate();
  const [reportDes, setReportDes] = useState("");
  const [community, setCommunity] = useState(null);
  const [rule, setRule] = useState("");
  const { id } = useParams();
  const [users, setUsers] = useState();
  const [communityName, setCommunityName] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const token = localStorage.getItem("token");
  const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];
  const [postId, setPostId] = useState(null); // Tạo state để lưu post._id
  const [joinReason, setJoinReason] = useState();
  // Hàm mở modal và lưu postId
  const openReportModal = (id) => {
    setPostId(id); // Lưu post._id vào state
    setShowModal1(true);
  };
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) setUser(userData);

    fetch(`http://localhost:9999/api/v1/communities/get-post/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const postsWithReactions = data.map((item) => ({
          ...item,
          upVotes: item.upVotes || 0,
          downVotes: item.downVotes || 0,
          upVoted: false,
          downVoted: false,
        }));
        setPosts(postsWithReactions);
      })
      .catch((error) => console.error("Error fetching posts:", error));
    fetchCommunity();
    fetchUser();
  }, []);

  const fetchCommunity = () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `http://localhost:9999/api/v1/communities/${id}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
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
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `http://localhost:9999/api/v1/communities/get-user/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        const result = response.data?.map((item) => item.userId);
        console.log(result);
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

  const handleJoin = () => {
    if (community?.privacyType == "public") {
      const data = JSON.stringify({
        userId: user.id,
        communityId: id,
        role: "member",
      });
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:9999/api/v1/communities/join",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      axios
        .request(config)
        .then((response) => {
          setShowModal2(false);
          alert("Joined community success!");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      let data = JSON.stringify({
        joinRequests: [
          {
            userId: user.id,
            reason: joinReason,
          },
        ],
      });

      let config = {
        method: "patch",
        maxBodyLength: Infinity,
        url: `http://localhost:9999/api/v1/communities/request/${id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          setShowModal2(false);
          alert("Your request have send to mod!!");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        {/* Main Content */}
        <Col md={8}>
          <Card className="mb-4 p-4">
            <div className="d-flex align-items-center mb-3">
              <img
                src={community?.logo}
                alt="Community Icon"
                className="rounded-circle"
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                }}
              />
              <h1 className="ml-3">f/{communityName}</h1>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              {user?.moderatorCommunities?.includes(id) ? (
                <Button variant="light" onClick={() => setShowModal(true)}>
                  Manage Comunity
                </Button>
              ) : (
                <ButtonGroup aria-label="Basic example">
                  <Button
                    variant="light"
                    onClick={() => navigate("/create-post")}
                  >
                    Create Post
                  </Button>
                  {!users?.includes(user?.id) ? (
                    <Button variant="light" onClick={() => setShowModal2(true)}>
                      Join
                    </Button>
                  ) : (
                    <Button variant="success" aria-readonly>
                      Joined
                    </Button>
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
          {posts.map((post, index) => (
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
                      <Dropdown.Item onClick={() => handleSave(post?._id)}>
                        Save
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => openReportModal(post?._id)}>
                        Report
                      </Dropdown.Item>
                      {post?.userId?.id === user?.id && (
                        <Dropdown.Item
                          onClick={() => navigate(`/edit-post/${post?._id}`)}
                        >
                          Edit
                        </Dropdown.Item>
                      )}
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
                <span className="mx-2">{post?.downVotes}</span>
                <Button
                  variant="light"
                  onClick={() => navigate(`/post/${post?._id}`)}
                >
                  <FaComment /> {post.commentsCount || 0}
                </Button>
              </div>
            </Card>
          ))}
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
