import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Col,
  Container,
  FormControl,
  Image,
  Row,
  Dropdown,
  Card,
} from "react-bootstrap";
import { FaArrowUp, FaArrowDown, FaComment, FaShare } from "react-icons/fa";

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
    comments: 0,
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
      <Row className="mt-3 mb-3">
        <Col md={1}>
          <Link to="/">
            <Button
              className="btn btn-secondary mt-2"
              style={{ borderRadius: "10px", float: "right" }}
            >
              Back
            </Button>
          </Link>
        </Col>
        <Col md={7}>
          <Card className="p-3">
            <Row>
              <Col md={12}>
                <Row className="mb-2">
                  <Col>
                    <p>
                      <strong>{postDetail.communityName}</strong> •{" "}
                      {postDetail.timeCreate}
                    </p>
                    <p style={{ marginTop: "-20px" }}>{postDetail.userName}</p>
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
            <Row className="mt-4">
              <Col md={12}>
                <Button
                  variant={postDetail.liked ? "success" : "light"}
                  onClick={handleLike}
                >
                  <FaArrowUp />
                </Button>
                <span className="mx-2">{postDetail.reactions.likes}</span>
                <Button
                  variant={postDetail.disliked ? "danger" : "light"}
                  onClick={handleDislike}
                >
                  <FaArrowDown />
                </Button>
                <span className="mx-2">{postDetail.reactions.dislikes}</span>
                <Button variant="light" className="mr-2">
                  <FaComment /> {postDetail.comments}
                </Button>
                <Button variant="light">
                  <FaShare /> Share
                </Button>
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
          </Card>
        </Col>

        <Col md={4}>
          <Card
            className="mb-4 p-3"
            style={{ height: "85vh", overflowY: "auto" }}
          >
            <h4>{postDetail.communityName}</h4>
            <p>
              This subreddit serves as a general hub to discuss most things
              Japanese and exchange information, as well as to guide users to
              subs specializing in things such as daily life, travel or language
              acquisition.
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

export default PostDetail;
