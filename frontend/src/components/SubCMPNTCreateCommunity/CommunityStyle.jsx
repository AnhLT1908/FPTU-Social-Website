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
            <div className="d-flex align-items-center">
              <label
                htmlFor="banner-upload"
                className="btn btn-outline-secondary"
              >
                Add
              </label>
              <input
                id="banner-upload"
                type="file"
                accept="image/*"
                className="d-none"
                onChange={(e) => handleImageUpload(e, "banner")}
              />
              {banner && (
                <Image
                  src={banner}
                  alt="Banner Preview"
                  className="ms-3"
                  style={{ width: "50px", height: "50px" }}
                />
              )}
            </div>
          </Form.Group>

          <Form.Group
            controlId="icon"
            className="mb-4 d-flex align-items-center"
          >
            <Form.Label className="me-3">Icon</Form.Label>
            <div className="d-flex align-items-center">
              <label
                htmlFor="icon-upload"
                className="btn btn-outline-secondary"
              >
                Add
              </label>
              <input
                id="icon-upload"
                type="file"
                accept="image/*"
                className="d-none"
                onChange={(e) => handleImageUpload(e, "icon")}
              />
              {icon && (
                <Image
                  src={icon}
                  alt="Icon Preview"
                  className="ms-3"
                  style={{ width: "50px", height: "50px" }}
                />
              )}
            </div>
          </Form.Group>
        </Form>
      </Container>
    </Container>
  );
};

export default CommunityStyle;
