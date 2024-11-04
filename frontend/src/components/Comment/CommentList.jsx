import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaArrowDown, FaArrowUp, FaComment, FaPlus } from 'react-icons/fa';
import {
  doVoteComment,
  listComments,
  postNewComment,
} from '../../services/CommentService';
import CommentForm from './CommentForm';
import { useParams } from 'react-router-dom';
const CommentList = () => {
  const [replyTo, setReplyTo] = useState(null); // Track the comment ID for reply
  const [commentList, setCommentList] = useState([]);
  const [startAfter, setStartAfter] = useState(null);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [visibleChildren, setVisibleChildren] = useState({});
  const user = JSON.parse(localStorage.getItem('user'));
  const { id } = useParams();
  const toggleChildrenVisibility = (commentId) => {
    setVisibleChildren((prev) => ({
      ...prev,
      [commentId]: !prev[commentId], // Toggle visibility
    }));
  };
  const fetchComments = async () => {
    const res = await listComments(id, startAfter);
    if (res) {
      setCommentList((prevList) => [...prevList, ...res.data]);
      if (res.startAfter) {
        setStartAfter(res.startAfter);
      } else setHasMoreComments(false);
    }
  };
  const handleReplyClick = (comment) => {
    console.log(comment);
    setReplyTo(comment); // Set the comment being replied to
  };

  const handleFormSubmit = async (commentData) => {
    const res = await postNewComment(commentData);
    if (commentData.hasParent) {
      const updatedComments = commentList.map((comment) => {
        if (comment._id === res.parentId) {
          return {
            ...comment,
            childrens: [...comment.childrens, res], // Add new comment to parent's children
          };
        }
        return comment;
      });
      setCommentList(updatedComments);
    } else setCommentList((prevList) => [res, ...prevList]);
    setReplyTo(null);
  };
  const handleVote = async (commentId, vote) => {
    // Handle the vote up logic
    const res = await doVoteComment(commentId, vote);
    // Update the commentList state with the new vote information
    setCommentList((prevList) =>
      prevList.map((comment) => {
        if (comment._id === commentId) {
          // Create a new votes object based on the current votes
          const updatedVotes = { ...comment.votes };

          // Update the votes based on the action
          if (vote === true) {
            updatedVotes[user.id] = true; // User voted up
          } else if (vote === false) {
            updatedVotes[user.id] = false; // User voted down
          } else {
            delete updatedVotes[user.id]; // User removed their vote
          }

          // Return the updated comment object
          return { ...comment, votes: updatedVotes };
        }
        return comment; // Return the comment unchanged if it doesn't match
      })
    );
  };
  useEffect(() => {
    fetchComments();
  }, []);
  return (
    <div>
      {commentList.map((comment) => (
        <div
          key={comment._id}
          className="comment"
          style={{
            marginBottom: '20px',
            border: '1px solid #e0e0e0',
            padding: '10px',
            borderRadius: '5px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={'/images/logo.jpg'} // Assuming the avatar URL is stored in comment.author.avatar
              alt={comment.userId.displayName}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                marginRight: '10px',
              }}
            />
            <span style={{ fontWeight: 'bold' }}>
              {comment.userId.displayName}
            </span>
          </div>
          <p>{comment.content}</p>
          {comment.tagInfo && (
            <span className="tagged-user">@{comment.tagInfo.tagName}</span>
          )}
          <div className="comment-actions">
            <Button
              variant={
                comment.votes && comment.votes[user.id] === true
                  ? 'success'
                  : 'light'
              }
              onClick={() =>
                comment.votes && comment.votes[user.id] === true
                  ? handleVote(comment._id, 'none')
                  : handleVote(comment._id, true)
              }
              aria-label="Vote Up"
            >
              <FaArrowUp />
            </Button>
            <span className="mx-2"></span>
            <Button
              variant={
                comment.votes && comment.votes[user.id] === false
                  ? 'danger'
                  : 'light'
              }
              onClick={() =>
                comment.votes && comment.votes[user.id] === false
                  ? handleVote(comment._id, 'none')
                  : handleVote(comment._id, false)
              }
              aria-label="Vote Down"
            >
              <FaArrowDown />
            </Button>
            <span className="mx-2"></span>
            <Button
              variant="light"
              onClick={() => handleReplyClick(comment, 'none')}
              aria-label="Reply"
            >
              <FaComment />
            </Button>
            <span className="mx-2"></span>
            {comment.childrens && comment.childrens.length > 0 && (
              <Button
                variant="light"
                onClick={() => toggleChildrenVisibility(comment._id)}
                aria-label="Toggle Children"
              >
                {visibleChildren[comment.id] ? 'Hide' : 'Show'}
              </Button>
            )}
          </div>
          {/* Conditionally render child comments */}
          {visibleChildren[comment._id] && (
            <div
              style={{
                marginLeft: '20px',
                borderLeft: '2px solid #e0e0e0',
                padding: '10px',
              }}
            >
              {comment.childrens.map((childComment) => (
                <div key={childComment._id}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={'/images/logo.jpg'} // Assuming the avatar URL is stored in comment.author.avatar
                      alt={comment.userId.displayName}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        marginRight: '10px',
                      }}
                    />
                    <span style={{ fontWeight: 'bold' }}>
                      {childComment.userId.displayName}
                    </span>
                  </div>
                  <p>
                    <span className="fw-bold">
                      {childComment.tagInfo && childComment.tagInfo.tagName}
                    </span>
                    &nbsp;
                    {childComment.content}
                  </p>
                  <div className="comment-actions">
                    <Button
                      variant={
                        childComment.votes &&
                        childComment.votes[user.id] === true
                          ? 'success'
                          : 'light'
                      }
                      onClick={() =>
                        childComment.votes &&
                        childComment.votes[user.id] === true
                          ? handleVote(childComment._id, 'none')
                          : handleVote(childComment._id, true)
                      }
                      aria-label="Vote Up"
                    >
                      <FaArrowUp />
                    </Button>
                    <span className="mx-2"></span>
                    <Button
                      variant={
                        childComment.votes &&
                        childComment.votes[user.id] === false
                          ? 'danger'
                          : 'light'
                      }
                      onClick={() =>
                        childComment.votes &&
                        childComment.votes[user.id] === false
                          ? handleVote(childComment._id, 'none')
                          : handleVote(childComment._id, false)
                      }
                      aria-label="Vote Down"
                    >
                      <FaArrowDown />
                    </Button>
                    <span className="mx-2"></span>
                    <Button
                      variant="light"
                      onClick={() => handleReplyClick(childComment)}
                      aria-label="Reply"
                    >
                      <FaComment />
                    </Button>
                    <span className="mx-2"></span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Conditionally render CommentForm if replying to this comment */}
          {(replyTo?._id == comment._id ||
            replyTo?.parentId == comment._id) && (
            <CommentForm
              postId={id}
              parentId={comment._id} // Pass parentId for the reply
              tagInfo={{
                userId: replyTo.userId._id,
                tagName: replyTo.userId.displayName,
              }} // Set tag info if needed
              onCommentSubmit={handleFormSubmit}
            />
          )}
        </div>
      ))}
      {/* Load More Comments button */}
      {hasMoreComments && (
        <Button
          onClick={fetchComments}
          variant="primary"
          style={{
            marginTop: '20px',
            display: 'block',
            backgroundColor: '#007bff', // Bootstrap primary color
            border: 'none',
          }}
        >
          Load More Comments
        </Button>
      )}
      <CommentForm
        postId={id}
        parentId={null} // No parent ID for direct comment
        tagInfo={null}
        onCommentSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default CommentList;
