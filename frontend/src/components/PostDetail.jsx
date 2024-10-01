import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Col,
  Container,
  FormControl,
  Image,
  Row,
} from "react-bootstrap";
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

const PostDetail = () => {
  const [postDetail, setPostDetail] = useState({
    id: "",
    title: "",
    body: "",
    reactions: {
      likes: 0,
      dislikes: 0,
    },
    comment: "",
    timeCreate: "",
    userName: "",
    communityName: "",
    liked: false,
    disliked: false,
  });

  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:9999/post/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPostDetail({
          ...data,
          liked: false,
          disliked: false,
        });
      })
      .catch((error) => console.log(error));
  }, [id]);

  const handleLike = () => {
    setPostDetail((prevPost) => {
      const newLikes = prevPost.liked
        ? prevPost.reactions.likes - 1
        : prevPost.reactions.likes + 1;
      const newDislikes = prevPost.disliked
        ? prevPost.reactions.dislikes - 1
        : prevPost.reactions.dislikes;

      return {
        ...prevPost,
        reactions: {
          ...prevPost.reactions,
          likes: newLikes,
          dislikes: newDislikes,
        },
        liked: !prevPost.liked,
        disliked: prevPost.disliked ? false : prevPost.disliked,
      };
    });
  };

  const handleDislike = () => {
    setPostDetail((prevPost) => {
      const newDislikes = prevPost.disliked
        ? prevPost.reactions.dislikes - 1
        : prevPost.reactions.dislikes + 1;
      const newLikes = prevPost.liked
        ? prevPost.reactions.likes - 1
        : prevPost.reactions.likes;

      return {
        ...prevPost,
        reactions: {
          ...prevPost.reactions,
          dislikes: newDislikes,
          likes: newLikes,
        },
        disliked: !prevPost.disliked,
        liked: prevPost.liked ? false : prevPost.liked,
      };
    });
  };

  const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];
  const imageIndex = parseInt(id) - 1;

  return (
    <Container fluid>
      <Row className="mt-3  mb-3">
        <Col md={2}>
          <Link to={"/"}>
            <Button
              className="btn btn-secondary mt-2"
              style={{ borderRadius: "10px", float: "right" }}
            >
              Back
            </Button>
          </Link>
        </Col>
        <Col
          md={8}
          style={{
            borderRight: "2px solid #dddddd",
            borderLeft: "2px solid #dddddd",
          }}
        >
          <Row>
            <Col md={12}>
              <Row className="d-flex">
                <Col md={3}>
                  <h5>{postDetail.communityName}</h5>
                </Col>
                <Col md={9} className="d-flex">
                  <Row>
                    <Col md={2}>
                      <FontAwesomeIcon icon={faClock} />
                    </Col>
                    <Col md={10}>
                      <p>{postDetail.timeCreate}</p>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <h6>{postDetail.userName}</h6>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <h2>{postDetail.title}</h2>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <p>{postDetail.body}</p>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Image
                src={images[imageIndex]}
                fluid
                style={{ width: "100%", borderRadius: "10px" }}
              />
            </Col>
          </Row>
          <Row className="mt-4" style={{ margin: "0px 0px" }}>
            <Col
              md={2}
              className="d-flex align-items-center"
              style={{
                backgroundColor: "#dddddd",
                borderRadius: "15px",
                marginRight: "20px",
              }}
            >
              <Row className="d-flex">
                <Col
                  className="d-flex align-items-center justify-content-center"
                  md={5}
                  style={{ marginLeft: "12px" }}
                >
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    onClick={handleLike}
                    style={{
                      cursor: "pointer",
                      color: postDetail.liked ? "blue" : "black",
                      marginRight: "5px",
                    }}
                  />
                  <h5 style={{ marginTop: "5px" }}>
                    {postDetail.reactions.likes}
                  </h5>
                </Col>
                <Col
                  className="d-flex align-items-center justify-content-center"
                  md={5}
                  style={{ marginTop: "3px", marginLeft: "12px" }}
                >
                  <FontAwesomeIcon
                    icon={faThumbsDown}
                    onClick={handleDislike}
                    style={{
                      cursor: "pointer",
                      color: postDetail.disliked ? "red" : "black",
                      marginRight: "5px",
                    }}
                  />
                  <h5 style={{ marginTop: "5px" }}>
                    {postDetail.reactions.dislikes}
                  </h5>
                </Col>
              </Row>
            </Col>

            <Col
              md={3}
              style={{
                backgroundColor: "#dddddd",
                borderRadius: "15px",
                marginRight: "20px",
                width: "20%",
              }}
            >
              <h5 style={{ textAlign: "center", marginTop: "7px" }}>
                {postDetail.comment} Comment
              </h5>
            </Col>

            <Col
              md={1}
              style={{
                backgroundColor: "#dddddd",
                borderRadius: "15px",
                marginRight: "20px",
              }}
            >
              <h5 style={{ textAlign: "center", marginTop: "7px" }}>Share</h5>
            </Col>

            <Col
              md={1}
              style={{
                backgroundColor: "#dddddd",
                borderRadius: "15px",
                marginRight: "20px",
              }}
            >
              <h5 style={{ textAlign: "center", marginTop: "7px" }}>Save</h5>
            </Col>

            <Col
              md={1}
              style={{
                backgroundColor: "#dddddd",
                borderRadius: "15px",
                marginRight: "20px",
                width: "10%",
              }}
            >
              <h5 style={{ textAlign: "center", marginTop: "7px" }}>Report</h5>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={12}>
              <FormControl
                style={{ borderRadius: "15px" }}
                type="text"
                placeholder="Add a comment"
              />
            </Col>
          </Row>
        </Col>
        <Col md={2}></Col>
      </Row>
    </Container>
  );
};

export default PostDetail;
