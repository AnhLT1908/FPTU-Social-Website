import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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
import CommentList from "./Comment/CommentList";

const PostDetail = () => {
  const [postDetail, setPostDetail] = useState({
    id: "",
    title: "",
    content: "",
    reactions: {
      upVotes: 0,
      downVotes: 0,
    },
    comments: 0,
    createdAt: "",
    userId: "",
    communityId: "",
    upVoted: false,
    downVoted: false,
    isActive: true,
  });

  console.log("Post detail:", postDetail);
  const { id } = useParams();
  useEffect(() => {
    fetch(`http://localhost:9999/api/v1/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPostDetail({
          ...data,
          reactions: data.reactions || { upVotes: 0, downVotes: 0 },
          upVoted: false,
          downVoted: false,
        });
      })
      .catch((error) => console.log(error));
  }, [id]);

  const handleLike = () => {
    setPostDetail((prevPost) => {
      const newupVotes = prevPost.upVoted
        ? prevPost.reactions?.upVotes - 1
        : prevPost.reactions?.upVotes + 1;
      const newdownVotes = prevPost.downVoted
        ? prevPost.reactions?.downVotes - 1
        : prevPost.reactions?.downVotes;

      return {
        ...prevPost,
        reactions: {
          ...prevPost.reactions,
          upVotes: newupVotes,
          downVotes: newdownVotes,
        },
        upVoted: !prevPost.upVoted,
        downVoted: prevPost.downVoted ? false : prevPost.downVoted,
      };
    });
  };

  const handleDislike = () => {
    setPostDetail((prevPost) => {
      const newdownVotes = prevPost.downVoted
        ? prevPost.reactions?.downVotes - 1
        : prevPost.reactions?.downVotes + 1;
      const newupVotes = prevPost.upVoted
        ? prevPost.reactions?.upVotes - 1
        : prevPost.reactions?.upVotes;

      return {
        ...prevPost,
        reactions: {
          ...prevPost.reactions,
          downVotes: newdownVotes,
          upVotes: newupVotes,
        },
        downVoted: !prevPost.downVoted,
        upVoted: prevPost.upVoted ? false : prevPost.upVoted,
      };
    });
  };

  const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];
  const navigate = useNavigate();
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
                    <Link to={"/community/2"}>
                      <p>
                        <strong>{"f/" + postDetail.communityId.name}</strong> •{" "}
                        {new Date(postDetail.createdAt).toLocaleString()}
                      </p>
                    </Link>
                    <p style={{ marginTop: "-20px" }}>
                      <Link to={`/profile/${postDetail.id}`}>
                        {"u/" + postDetail.userId.username}
                      </Link>
                    </p>
                  </Col>
                  <Col className="d-flex justify-content-end align-items-center"></Col>
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
                <p>{postDetail.content}</p>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Image
                  src={images[0]}
                  fluid
                  style={{ width: "100%", borderRadius: "10px" }}
                />
              </Col>
            </Row>
            <Row className="mt-4">
              <Col md={12}>
                <Button
                  variant={postDetail.upVoted ? "success" : "light"}
                  onClick={handleLike}
                >
                  <FaArrowUp />
                </Button>
                <span className="mx-2">{postDetail.reactions?.upVotes}</span>
                <Button
                  variant={postDetail.downVoted ? "danger" : "light"}
                  onClick={handleDislike}
                >
                  <FaArrowDown />
                </Button>
                <span className="mx-2">{postDetail.reactions?.downVotes}</span>
                <Button variant="light" className="mr-2">
                  <FaComment /> {postDetail.comments}
                </Button>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col md={12}>
                <CommentList postId={postDetail.id} />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col md={4}>
          <Card
            className="mb-4 p-3"
            style={{ height: "85vh", overflowY: "auto" }}
          >
            <h4>{"f/" + postDetail.communityId.name}</h4>
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
