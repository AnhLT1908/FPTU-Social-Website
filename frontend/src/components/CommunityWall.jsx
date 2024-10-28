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
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaArrowUp, FaArrowDown, FaComment, FaShare } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
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
  const [showHighlights, setShowHighlights] = useState(false);
  const [voteStatus, setVoteStatus] = useState(null);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) setUser(userData);

    fetch("http://localhost:9999/api/v1/posts/")
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

  const handleImageClick = (image) => {
    setModalImage(image);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalImage(null);
  };

  const handleUpvote = () => {
    setVoteStatus(voteStatus === "up" ? null : "up");
  };

  const handleDownvote = () => {
    setVoteStatus(voteStatus === "down" ? null : "down");
  };

  const toggleHighlights = () => {
    setShowHighlights(!showHighlights);
  };

  const handleJoin = () => {
    alert("Joined community success!");
    const data = JSON.stringify({
      userId: "671df2d274687d48d0bdc4ed",
      communityId: "671de826180594244866bf68",
      role: "member",
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:5173/api/v1/communities/join",
      headers: {
        "Content-Type": "application/json",
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
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        {/* Main Content */}
        <Col md={8}>
          <Card className="mb-4 p-4">
            <div className="d-flex align-items-center mb-3">
              <img
                src="https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/anh-dep-thien-nhien-2-1.jpg"
                alt="Community Icon"
                className="rounded-circle"
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                }}
              />
              <h1 className="ml-3">f/FPTU</h1>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  Hot
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>New</Dropdown.Item>
                  <Dropdown.Item>Top</Dropdown.Item>
                  <Dropdown.Item>Rising</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <ButtonGroup aria-label="Basic example">
                <Button variant="light" onClick={() => navigate("/create-post")}>
                  Create Post
                </Button>
                <Button variant="light" onClick={handleJoin}>
                  Join
                </Button>
              </ButtonGroup>
            </div>
          </Card>

          <Card className="mb-3 p-3">
            <strong onClick={toggleHighlights} style={{ cursor: "pointer" }}>
              Community highlights
            </strong>
            {showHighlights && (
              <Card className="mt-2 p-2">
                <p className="mb-0">
                  THE JAPAN SUBREDDIT DIRECTORY / BASIC QUESTIONS THREAD
                  (Winter/Spring 2024)
                </p>
                <small>51 votes • 314 comments</small>
              </Card>
            )}
          </Card>

          {posts.map((post, index) => (
            <Card key={post._id} className="mb-3 p-3">
              <Row>
                <Col>
                  <Link to={`/community/${post.communityId}`}>
                    <p>
                      <strong>{"f/" + (post.communityId?.name || "Community Name")}</strong> •{" "}
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </Link>
                  <Link to={`/profile/${post.userId}`}>
                    <p className="mt-n2">{"u/" + (post.userId?.username || "Username")}</p>
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
        </Col>

        {/* Sidebar */}
        <Col md={4}>
          <Card
            className="mb-4 p-3"
            style={{ height: "85vh", overflowY: "auto" }}
          >
            <h4>FPTU</h4>
            <p>
              This subreddit serves as a general hub to discuss most things
              Japanese and exchange information, **as well as to guide users to
              subs specializing in things such as daily life, travel or language
              acquisition.**
            </p>
            <p>
              Users are strongly encouraged to check the sidebar and stickied
              general questions thread before posting.
            </p>
            <hr />
            <p>
              <strong>Created</strong> Jan 25, 2008
            </p>
            <p>Public</p>
            <hr />
            <div className="d-flex justify-content-between">
              <p>
                <strong>1.3M</strong> Members
              </p>
              <p>
                <strong>68</strong> Online
              </p>
              <p>Top 1% Rank by size</p>
            </div>
            <hr />
            <h5>User Flair</h5>
            <p>Expert_Post3875</p>
            <hr />
            <h5>Rules</h5>
            <ul>
              <li>No racism/hatemongering/harassment</li>
              <li>No blog/vlog/product spam/crowdfunding/begging</li>
              <li>Check the sidebar for the correct subreddit</li>
              <li>Submission titles should be relevant & informative</li>
              <li>Don't be a troll</li>
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
