import React from "react";
import { Container, Form } from "react-bootstrap";

const CommunityDetails = ({
  communityName,
  setCommunityName,
  description,
  setDescription,
}) => {
  return (
    <Container className="p-3 mb-4">
      <h3>Tell us about your community</h3>
      <p>
        A name and description help people understand what your community is all
        about.
      </p>
      <hr className="my-4" style={{ borderTop: "1px solid black" }} />
      <Form>
        {/* Block for Community Name */}
        <Form.Group controlId="communityName" className="mb-3">
          <Form.Label>Community name *</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter community name"
            value={communityName}
            onChange={(e) => setCommunityName(e.target.value)}
          />
        </Form.Group>

        {/* Horizontal line for separation */}

        {/* Block for Description */}
        <Form.Group controlId="description" className="mb-3">
          <Form.Label>Description *</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
      </Form>
    </Container>
  );
};

export default CommunityDetails;
