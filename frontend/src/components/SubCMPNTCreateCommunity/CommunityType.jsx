import React from "react";
import { Container, Card, Form, ListGroup } from "react-bootstrap";

const CommunityType = ({
  communityType,
  setCommunityType,
  isMature,
  setIsMature,
}) => {
  const handleCommunityTypeChange = (e) => {
    setCommunityType(e.target.value);
  };

  const handleMatureToggle = () => {
    setIsMature(!isMature);
  };

  return (
    <Container className="p-3 mb-4 ">
      <Container>
        <h3>What kind of community is this?</h3>
        <p>
          Decide who can view and contribute in your community.
        </p>
        <hr className="my-4" style={{ borderTop: "1px solid black" }} />
        <Form>
          <ListGroup>
            <ListGroup.Item>
              <Form.Group className="mb-3">
                <Form.Check
                  type="radio"
                  label={
                    <>
                      <strong>Public</strong>
                      <br />
                      <small>
                        Anyone can view, post, and comment to this community
                      </small>
                    </>
                  }
                  name="communityType"
                  value="public"
                  checked={communityType === "public"}
                  onChange={handleCommunityTypeChange}
                  id="public"
                />
              </Form.Group>
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Group className="mb-3">
                <Form.Check
                  type="radio"
                  label={
                    <>
                      <strong>Restricted</strong>
                      <br />
                      <small>
                        Anyone can view, but only approved users can contribute
                      </small>
                    </>
                  }
                  name="communityType"
                  value="restricted"
                  checked={communityType === "restricted"}
                  onChange={handleCommunityTypeChange}
                  id="restricted"
                />
              </Form.Group>
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Group className="mb-3">
                <Form.Check
                  type="radio"
                  label={
                    <>
                      <strong>Private</strong>
                      <br />
                      <small>Only approved users can view and contribute</small>
                    </>
                  }
                  name="communityType"
                  value="private"
                  checked={communityType === "private"}
                  onChange={handleCommunityTypeChange}
                  id="private"
                />
              </Form.Group>
            </ListGroup.Item>
          </ListGroup>
        </Form>
      </Container>
    </Container>
  );
};

export default CommunityType;
