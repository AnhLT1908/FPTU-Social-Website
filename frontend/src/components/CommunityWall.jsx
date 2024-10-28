import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import axios from "axios";
const CommunityPage = () => {
  const navigate = useNavigate();
  const [showHighlights, setShowHighlights] = useState(false);
  const [voteStatus, setVoteStatus] = useState(null);
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
    alert("Joined community sucess!");
    let data = JSON.stringify({
      userId: "671df2d274687d48d0bdc4ed",
      communityId: "671de826180594244866bf68",
      role: "member",
    });

    let config = {
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
                <Button
                  variant="light"
                  onClick={() => navigate("/create-post")}
                >
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

          {/* Post 1 */}
          <Card className="mb-3 p-3">
            <Row className="mb-2">
              <Col>
                <p>
                  <strong>u/Jonnyboo234</strong> • 4 hr. ago
                </p>
              </Col>
              <Col className="d-flex justify-content-end align-items-center">
                <Dropdown>
                  <Dropdown.Toggle variant="light" id="dropdown-basic">
                    Settings
                  </Dropdown.Toggle>
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
                <h5>Japan’s speedy Shinkansen turns 60</h5>
                <p>
                  Her white-gloved, waistcoated uniform impeccable, 22-year-old
                  Hazuki Okuno boards a bullet train replica to rehearse the
                  strict protocols behind the smooth operation of a Japanese
                  institution turning 60 Tuesday.
                </p>
              </Col>
              <Col md={4}>
                <Image
                  src="https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/anh-dep-thien-nhien-2-1.jpg"
                  alt="Post Image"
                  fluid
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              </Col>
            </Row>

            <div className="d-flex align-items-center mt-3">
              <Button
                variant={voteStatus === "up" ? "success" : "light"}
                onClick={handleUpvote}
              >
                <FaArrowUp />
              </Button>
              <span className="mx-2">88</span>
              <Button
                variant={voteStatus === "down" ? "danger" : "light"}
                onClick={handleDownvote}
              >
                <FaArrowDown />
              </Button>

              <Button variant="light" className="mr-2">
                <FaComment /> 5
              </Button>
              <Button variant="light">
                <FaShare /> Share
              </Button>
            </div>
          </Card>
          <hr></hr>
          {/* Post 2 */}
          <Card className="mb-3 p-3">
            <Row className="mb-2">
              <Col>
                <p>
                  <strong>u/Jonnyboo234</strong> • 4 hr. ago
                </p>
              </Col>
              <Col className="d-flex justify-content-end align-items-center">
                <Dropdown>
                  <Dropdown.Toggle variant="light" id="dropdown-basic">
                    Settings
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>Save</Dropdown.Item>
                    <Dropdown.Item>Report</Dropdown.Item>
                    <Dropdown.Item>Hide</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
            <Row>
              <Col md={8}>
                <h5>
                  Japan’s humble onigiri takes over lunchtimes around the world
                </h5>
                <p>
                  “It’s always like this,” says Yumiko Ukon, who has run this
                  modest rice ball shop and restaurant in the Otsuka
                  neighbourhood of Tokyo for almost half a century. “But we
                  never run out of rice,” she adds, seated in her office near a
                  wall clock in the shape of a rice ball with a bite taken out.
                </p>
              </Col>
              <Col md={4}>
                <Image
                  src="https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/anh-dep-thien-nhien-2-1.jpg"
                  alt="Post Image"
                  fluid
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              </Col>
            </Row>
            <div className="d-flex align-items-center mt-3">
              <Button
                variant={voteStatus === "up" ? "success" : "light"}
                onClick={handleUpvote}
              >
                <FaArrowUp />
              </Button>
              <span className="mx-2">888</span>
              <Button
                variant={voteStatus === "down" ? "danger" : "light"}
                onClick={handleDownvote}
              >
                <FaArrowDown />
              </Button>

              <Button variant="light" className="mr-2">
                <FaComment /> 81
              </Button>
              <Button variant="light">
                <FaShare /> Share
              </Button>
            </div>
          </Card>
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
