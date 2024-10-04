import React from "react";
import { Container, Card, Form, Badge } from "react-bootstrap";

const CommunityTopics = ({ selectedTopics, setSelectedTopics, topicsList }) => {
  const handleTopicSelect = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else if (selectedTopics.length < 3) {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  return (
    <Container className="p-3 mb-4">
      <Container>
        <h3>Add topics</h3>
        <p>
          Add up to 3 topics to help interested redditor find your community.
        </p>
        <hr className="my-4" style={{ borderTop: "1px solid black" }} />
        <Form.Group controlId="topics" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Filter topics"
            className="mb-3"
          />
          <p>Topics {selectedTopics.length}/3</p>
          <div className="d-flex flex-wrap">
            {topicsList.map((topic, index) => (
              <Badge
                key={index}
                bg={selectedTopics.includes(topic) ? "warning" : "secondary"}
                onClick={() => handleTopicSelect(topic)}
                className="m-1"
                style={{ cursor: "pointer" }}
              >
                {topic}
              </Badge>
            ))}
          </div>
        </Form.Group>
      </Container>
    </Container>
  );
};

export default CommunityTopics;
