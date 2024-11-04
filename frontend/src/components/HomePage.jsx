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

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) setUser(userData);
    fetch("http://localhost:9999/api/v1/posts/my-feed")
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
  }, []);

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

  console.log(token)


  const handleImageClick = (image) => {
    setModalImage(image);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalImage(null);
  };

  return (
    <Container>
      <Row className="mt-2 mb-2">
        <Col md={12}>
          <Row className="mb-2">
            <Col>
              <Dropdown>
                <Dropdown.Toggle variant="light">New</Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>Hot</Dropdown.Item>
                  <Dropdown.Item>Top</Dropdown.Item>
                  <Dropdown.Item>Rising</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>

          {posts.map((post, index) => (
            <Card key={post._id} className="mb-3 p-3">
              <Row>
                <Col>
                  <Link to={`/community/${post.communityId}`}>
                    <p>
                      <strong>{"f/" + post.communityId?.name || "Community Name"}</strong> •{" "}
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </Link>
                  <Link to={`/profile/${post.userId}`}>
                    <p className="mt-n2">{"u/" + post.userId?.username || "Username"}</p>
                  </Link>
                </Col>
                <Col className="d-flex justify-content-end">
                  <Dropdown>
                    <Dropdown.Toggle variant="light">Settings</Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>Save</Dropdown.Item>
                      <Dropdown.Item>Report</Dropdown.Item>
                      <Dropdown.Item>Hide</Dropdown.Item>
                      <Dropdown.Item onClick={() => navigate(`/edit-post/${post._id}`)}>
                        Edit
                      </Dropdown.Item>
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
                    onClick={() => handleImageClick(images[index % images.length])}
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
                <Button variant="light">
                  <FaShare /> Share
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
