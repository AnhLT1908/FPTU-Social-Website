import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Col,
  Container,
  FormControl,
  Image,
  Row,
  Dropdown,
  Card,
} from 'react-bootstrap';
import { FaArrowUp, FaArrowDown, FaComment, FaShare } from 'react-icons/fa';

import img1 from '../images/postImage/images_postId1.jpg';
import img2 from '../images/postImage/images_postId2.jpg';
import img3 from '../images/postImage/images_postId3.jpg';
import img4 from '../images/postImage/images_postId4.jpg';
import img5 from '../images/postImage/images_postId5.jpg';
import img6 from '../images/postImage/images_postId6.jpg';
import img7 from '../images/postImage/images_postId7.jpg';
import img8 from '../images/postImage/images_postId8.jpg';
import img9 from '../images/postImage/images_postId9.jpg';
import img10 from '../images/postImage/images_postId10.jpg';
import CommentList from './Comment/CommentList';
import { doVotePost, getPostDetail } from '../services/PostService';

const PostDetail = () => {
  const [postDetail, setPostDetail] = useState({});
  const { id } = useParams();
  console.log(id);
  const user = JSON.parse(localStorage.getItem('user'));
  const fetchPostDetail = async () => {
    const res = await getPostDetail(id);
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

  return (
    <Container fluid>
      <Row className="mt-3 mb-3">
        <Col md={1}>
          <Link to="/">
            <Button
              className="btn btn-secondary mt-2"
              style={{ borderRadius: '10px', float: 'right' }}
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
                    <Link to={'/community/2'}>
                      <p>
                        <strong>{postDetail.communityName}</strong> •{' '}
                        {postDetail.timeCreate}
                      </p>
                    </Link>
                    <p style={{ marginTop: '-20px' }}>
                      <Link to={`/profile/${postDetail.id}`}>
                        {postDetail.userName}
                      </Link>
                    </p>
                  </Col>
                  <Col className="d-flex justify-content-end align-items-center">
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="light"
                        id="dropdown-basic"
                      >
                        Settings
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item>Save</Dropdown.Item>
                        <Dropdown.Item>Report</Dropdown.Item>
                        <Dropdown.Item>Hide</Dropdown.Item>
                        <Dropdown.Item onClick={() => navigate('/edit-post/2')}>
                          Edit
                        </Dropdown.Item>
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
                  style={{ width: '100%', borderRadius: '10px' }}
                />
              </Col>
            </Row>
            <Row className="mt-4">
              <Col md={12}>
                <Button
                  variant={
                    postDetail.votes && postDetail.votes[user.id] === true
                      ? 'success'
                      : 'light'
                  }
                  onClick={() =>
                    postDetail.votes && postDetail.votes[user.id] === true
                      ? handleVote(postDetail.id, 'none')
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
                      ? 'danger'
                      : 'light'
                  }
                  onClick={() =>
                    postDetail.votes && postDetail.votes[user.id] === false
                      ? handleVote(postDetail._id, 'none')
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
                <Button
                  variant="light"
                  className="mr-2"
                >
                  <FaComment /> {postDetail.comments}
                </Button>
                <Button variant="light">
                  <FaShare /> Share
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
            style={{ height: '85vh', overflowY: 'auto' }}
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
