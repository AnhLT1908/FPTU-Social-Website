import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, FormControl, Button, Toast } from 'react-bootstrap';
import '../../styles/commentForm.css';
const CommentForm = ({ postId, parentId, tagInfo, onCommentSubmit }) => {
  const [comment, setComment] = useState('');
  const editableRef = useRef(null);
  // Handle function for input change
  const handleCommentChange = (e) => {
    const inputText = e.target.innerText;
    // Remove the '@tagName' if it exists at the start
    if (tagInfo && tagInfo.tagName) {
      const taggedName = `@${tagInfo.tagName}`;
      // Check if the input starts with the tagged name
      if (inputText.startsWith(taggedName)) {
        setComment(inputText.slice(taggedName.length).trim()); // Remove the tagged name
      } else {
        setComment(inputText); // Set the comment as is
      }
    } else {
      setComment(inputText); // Set the comment as is if no tagInfo
    }
  };

  // Handle function for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        postId,
        content: comment,
        parentId: parentId || null,
        hasParent: parentId ? true : false,
      };
      if (tagInfo) {
        newComment.tagInfo = {
          userId: tagInfo.userId,
          tagName: tagInfo.tagName,
        };
      }
      console.log('Comment submitted:', newComment);
      onCommentSubmit(newComment);
      setComment(''); // Clear input after submission
      editableRef.current.innerHTML = '';
    }
  };
  useEffect(() => {
    if (tagInfo && tagInfo.tagName) {
      const initialContent = `@${tagInfo.tagName} `;
      setComment(initialContent);
      editableRef.current.innerHTML = `<span class="tagged" contenteditable="false">@${tagInfo.tagName}</span> `;
    }
  }, [tagInfo]);
  return (
    <form onSubmit={handleSubmit}>
      <Row className="mt-4">
        <Col md={10}>
          <div
            ref={editableRef}
            className="comment-input"
            contentEditable
            placeholder="Add a comment"
            onInput={handleCommentChange}
          />
        </Col>
        <Col md={2}>
          <Button
            type="submit"
            variant="primary"
            style={{ borderRadius: '15px', width: '100%' }}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </form>
  );
};

export default CommentForm;
