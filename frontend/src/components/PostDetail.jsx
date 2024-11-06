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
import { doVotePost, getPostDetail } from "../services/PostService";

const PostDetail = () => {
  const [postDetail, setPostDetail] = useState({});

  const { id } = useParams();
  console.log(id);
  const user = JSON.parse(localStorage.getItem("user"));
  const fetchPostDetail = async () => {
    const res = await getPostDetail(id);
    console.log("Post detail", res);
    setPostDetail(res);
  };
  useEffect(() => {
    fetchPostDetail();
  }, [id]);

  const handleVote = async (postId, vote) => {
    // Handle the vote up logic
    const res = await doVotePost(postId, vote);
    // Update the commentList state with the new vote information
    setPostDetail((prevPost) => {
      // Create a new votes object based on the current votes
      const updatedVotes = { ...prevPost.votes };

      // Update the votes based on the action
      if (vote === true) {
        updatedVotes[user.id] = true; // User voted up
      } else if (vote === false) {
        updatedVotes[user.id] = false; // User voted down
      } else {
        delete updatedVotes[user.id]; // User removed their vote
      }
      // Return the updated post object
      return { ...prevPost, votes: updatedVotes };
    });
  };
  const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];
  const navigate = useNavigate();
  const imageIndex = parseInt(id) - 1;
  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

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
                        <strong>{"f/" + postDetail.communityId?.name}</strong> •{" "}
                        {new Date(postDetail.createdAt).toLocaleString()}
                      </p>
                    </Link>
                    <p style={{ marginTop: "-20px" }}>
                      <Link to={`/profile/${postDetail.id}`}>
                        u/{postDetail.userId?.username}
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
                {postDetail?.media &&
                postDetail.media.length > 0 &&
                postDetail.media[0] ? (
                  <Image
                    src={postDetail.media[0]}
                    fluid
                    style={{ width: "100%", borderRadius: "10px" }}
                  />
                ) : (
                  <div></div>
                )}
              </Col>
            </Row>
            <Row className="mt-4">
              <Col md={12}>
                <Button
                  variant={
                    postDetail.votes && postDetail.votes[user.id] === true
                      ? "success"
                      : "light"
                  }
                  onClick={() =>
                    postDetail.votes && postDetail.votes[user.id] === true
                      ? handleVote(postDetail.id, "none")
                      : handleVote(postDetail.id, true)
                  }
                  aria-label="Vote Up"
                >
                  <FaArrowUp />
                  {
                    Object.values(postDetail.votes || {}).filter(
                      (vote) => vote === true
                    ).length
                  }
                </Button>
                <span className="mx-2"></span>
                <Button
                  variant={
                    postDetail.votes && postDetail.votes[user.id] === false
                      ? "danger"
                      : "light"
                  }
                  onClick={() =>
                    postDetail.votes && postDetail.votes[user.id] === false
                      ? handleVote(postDetail._id, "none")
                      : handleVote(postDetail._id, false)
                  }
                  aria-label="Vote Down"
                >
                  <FaArrowDown />
                  {
                    Object.values(postDetail.votes || {}).filter(
                      (vote) => vote === false
                    ).length
                  }
                </Button>
                <span className="mx-2"></span>
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
            <h3>f/{postDetail.communityId?.name}</h3>
            <h5>{postDetail.communityId?.description}</h5>
            <hr />
            <p>
              <strong>Created</strong>{" "}
              {new Date(postDetail.communityId?.createdAt).toLocaleString()}
            </p>
            <p>{capitalizeFirstLetter(postDetail.communityId?.privacyType)}</p>
            <hr />
            <div className="d-flex justify-content-between">
              <p>
                <strong>300</strong> Members
              </p>
              <p>
                <strong>1</strong> Online
              </p>
              <p>Top 70% Rank by size</p>
            </div>
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
