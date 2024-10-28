import React from "react";
import { Container, Card, Form, Image } from "react-bootstrap";

const CommunityStyle = ({
  banner,
  setBanner,
  icon,
  setIcon,
  handleImageUpload,
}) => {
  return (
    <Container className="p-3 mb-4">
      <Container>
        <h3>Style your community</h3>
        <p>
          Adding visual flair will catch new members attention and help
          establish your community's culture! You can update this at any time.
        </p>
        <hr className="my-4" style={{ borderTop: "1px solid black" }} />
        <Form>
          <Form.Group
            controlId="banner"
            className="mb-4 d-flex align-items-center"
          >
            <Form.Label className="me-3">Banner</Form.Label>

            <Form.Control
              as="textarea"
              rows={1}
              placeholder="Enter banner url"
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
            />
          </Form.Group>

          <Form.Group
            controlId="icon"
            className="mb-4 d-flex align-items-center"
          >
            <Form.Label className="me-3">Icon</Form.Label>

            <Form.Control
              as="textarea"
              rows={1}
              placeholder="Enter logo url"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Container>
    </Container>
  );
};

export default CommunityStyle;
