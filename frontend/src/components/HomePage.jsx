import React, { useEffect, useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

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

  return (
    <Container fluid>
      <Row className="d-flex mt-3">
        <Col md={10}>
          <Row className="d-flex mt-5">
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
            <Row className="mt-2 mb-5" key={item.id}>
              <Col md={12}>
                <Row className="d-flex">
                  <Col md={2}>
                    <Image
                      src={images[index]}
                      alt={`post-${index + 1}`}
                      style={{ width: "100%", borderRadius: "10px" }}
                      fluid
                    />
                  </Col>
                  <Col md={10} className="d-flex flex-column justify-content-between">
                    <Row className="d-flex">
                      <Col md={2}>
                        <h5>{item.userId}</h5>
                      </Col>
                      <Col md={4} className="d-flex">
                        <Row>
                          <Col md={2}>
                            <FontAwesomeIcon icon={faClock} />
                          </Col>
                          <Col md={10}>
                            <p>One year ago</p>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <h3>{item.title}</h3>
                      </Col>
                    </Row>
                    <Row className="d-flex">
                      <Col md={1} className="d-flex">
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

                      <Col md={1}>
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

                      <Col md={2}>
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
            <Col m={12}  className="d-flex justify-content-center">
                <h3><a style={{textDecoration: 'none'}} href="#">No more content</a></h3>
            </Col>
          </Row>
        </Col>
        <Col md={2}></Col>
      </Row>
    </Container>
  );
};

export default HomePage;
