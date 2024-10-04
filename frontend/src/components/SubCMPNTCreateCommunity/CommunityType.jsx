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
          Decide who can view and contribute in your community. Only public
          communities show up in search.
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
                  value="Public"
                  checked={communityType === "Public"}
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
                  value="Restricted"
                  checked={communityType === "Restricted"}
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
                  value="Private"
                  checked={communityType === "Private"}
                  onChange={handleCommunityTypeChange}
                  id="private"
                />
              </Form.Group>
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Group className="form-switch">
                <Form.Check
                  type="checkbox"
                  label={
                    <>
                      <strong>Mature (18+)</strong>
                      <br />
                      <small>
                        Users must be over 18 to view and contribute.
                      </small>
                    </>
                  }
                  id="matureToggle"
                  checked={isMature}
                  onChange={handleMatureToggle}
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
