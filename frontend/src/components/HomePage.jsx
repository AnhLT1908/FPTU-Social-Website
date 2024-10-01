import React, { useEffect, useState } from "react";
import { Col, Container, Image, Row, Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";

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
  const [post, setPost] = useState([]);
  const [activeButton, setActiveButton] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:9999/post`)
      .then((res) => res.json())
      .then((data) => {
        const postWithReactions = data.map((item) => ({
          ...item,
          likes: item.reactions.likes,
          dislikes: item.reactions.dislikes,
          liked: false,
          disliked: false,
        }));
        setPost(postWithReactions);
      })
      .catch((error) => console.log(error));
  }, []);

  const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

  const buttons = ["Hot", "Top", "New"];

  const handleLike = (index) => {
    setPost((prevPost) => {
      const updatedPost = [...prevPost];
      if (updatedPost[index].liked) {
        updatedPost[index].likes -= 1;
      } else {
        if (updatedPost[index].disliked) {
          updatedPost[index].dislikes -= 1;
          updatedPost[index].disliked = false;
        }
        updatedPost[index].likes += 1;
      }
      updatedPost[index].liked = !updatedPost[index].liked;
      return updatedPost;
    });
  };

  const handleDislike = (index) => {
    setPost((prevPost) => {
      const updatedPost = [...prevPost];
      if (updatedPost[index].disliked) {
        updatedPost[index].dislikes -= 1;
      } else {
        if (updatedPost[index].liked) {
          updatedPost[index].likes -= 1;
          updatedPost[index].liked = false;
        }
        updatedPost[index].dislikes += 1;
      }
      updatedPost[index].disliked = !updatedPost[index].disliked;
      return updatedPost;
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
      <Row className="d-flex mt-3 mb-3">
        <Col md={2}></Col>
        <Col
          md={8}
          style={{
            borderRight: "2px solid #dddddd",
            borderLeft: "2px solid #dddddd"
          }}
        >
          <Row className="d-flex">
            <Col md={3} className="d-flex">
              {buttons.map((button, index) => (
                <h3
                  key={index}
                  onClick={() => setActiveButton(button)}
                  onMouseEnter={() => setHoveredButton(button)}
                  onMouseLeave={() => setHoveredButton(null)}
                  style={{
                    marginRight: "10px",
                    padding: "5px 10px",
                    backgroundColor:
                      activeButton === button || hoveredButton === button
                        ? "gray"
                        : "transparent",
                    borderRadius: "10px",
                    cursor: "pointer",
                    color: activeButton === button ? "white" : "black",
                  }}
                >
                  {button}
                </h3>
              ))}
            </Col>
          </Row>

          {post.map((item, index) => (
            <Row
              className="mt-2 mb-5"
              key={item.id}
              style={{ borderBottom: "2px solid #dddddd", margin: "0 10px" }}
            >
              <Col md={12}>
                <Row className="d-flex">
                  <Col md={2}>
                    <Image
                      src={images[index]}
                      alt={`post-${index + 1}`}
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                        cursor: "pointer",
                      }}
                      fluid
                      onClick={() => handleImageClick(images[index])}
                    />
                  </Col>
                  <Col
                    md={10}
                    className="d-flex flex-column justify-content-between"
                  >
                    <Row className="d-flex">
                      <Col md={6}>
                        <h5>
                          By {item.userName} in {item.communityName}
                        </h5>
                      </Col>
                      <Col md={6} className="d-flex">
                        <Row>
                          <Col md={2}>
                            <FontAwesomeIcon icon={faClock} />
                          </Col>
                          <Col md={10}>
                            <p>{item.timeCreate}</p>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row className="d-flex mb-3">
                      <Col md={12}>
                        <Link to={`/post/${item.id}`}>
                          <h4>{item.title}</h4>
                        </Link>
                      </Col>
                    </Row>
                    <Row className="d-flex">
                      <Col md={1}>
                        <Row>
                          <Col md={2}>
                            <FontAwesomeIcon
                              icon={faThumbsUp}
                              onClick={() => handleLike(index)}
                              style={{
                                cursor: "pointer",
                                color: item.liked ? "blue" : "black",
                              }}
                            />
                          </Col>
                          <Col md={2}>
                            <h5>{item.likes}</h5>
                          </Col>
                        </Row>
                      </Col>

                      <Col md={2}>
                        <Row>
                          <Col md={2}>
                            <FontAwesomeIcon
                              icon={faThumbsDown}
                              onClick={() => handleDislike(index)}
                              style={{
                                cursor: "pointer",
                                color: item.disliked ? "red" : "black",
                              }}
                            />
                          </Col>
                          <Col md={2}>
                            <h5>{item.dislikes}</h5>
                          </Col>
                        </Row>
                      </Col>

                      <Col md={3}>
                        <h5>{item.comment} Comment</h5>
                      </Col>

                      <Col md={1}>
                        <h5>Share</h5>
                      </Col>

                      <Col md={1}>
                        <h5>Save</h5>
                      </Col>

                      <Col md={1}>
                        <h5>Report</h5>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          ))}

          <Row>
            <Col md={12} className="d-flex justify-content-center">
              <h3>
                <a style={{ textDecoration: "none" }} href="#">
                  No more content
                </a>
              </h3>
            </Col>
          </Row>
        </Col>
        <Col md={2}></Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Body>
          <Image src={modalImage} fluid style={{ width: "100%" }} />
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
