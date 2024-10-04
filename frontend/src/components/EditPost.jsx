import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, Button, Dropdown, Tabs, Tab } from "react-bootstrap";

const EditPost = ({ initialData }) => {
  // Sử dụng state để quản lý dữ liệu bài đăng
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedTab, setSelectedTab] = useState("text");
  const [mediaFiles, setMediaFiles] = useState([]);

  // Sử dụng useEffect để load dữ liệu bài đăng ban đầu khi component được mount
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setBody(initialData.body);
      setSelectedTab(
        initialData.mediaFiles && initialData.mediaFiles.length > 0
          ? "images"
          : "text"
      );
      setMediaFiles(initialData.mediaFiles || []);
    }
  }, [initialData]);

  const handleTabSelect = (key) => {
    setSelectedTab(key);
  };

  const handleMediaChange = (e) => {
    setMediaFiles([...e.target.files]);
  };

  return (
    <Container
      className="mt-5 bg-white mb-5"
      style={{
        maxWidth: "800px",
        boxShadow: "0 4px 8px grey",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Edit Post</h2>
      </div>

      <Dropdown className="mb-3">
        <Dropdown.Toggle variant="light" id="dropdown-basic">
          Select a community
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">Community 1</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Community 2</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Community 3</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Tabs activeKey={selectedTab} onSelect={handleTabSelect} className="mb-3">
        <Tab eventKey="text" title="Text" />
        <Tab eventKey="images" title="Images & Video" />
      </Tabs>

      <Form>
        <Form.Group controlId="postTitle" className="mb-3">
          <Form.Label>Title </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={300}
          />
          <Form.Text className="text-muted">{title.length}/300</Form.Text>
        </Form.Group>

        {selectedTab === "text" && (
          <Form.Group controlId="postBody" className="mb-3">
            <Form.Label>Body</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Body"
            />
          </Form.Group>
        )}

        {selectedTab === "images" && (
          <Form.Group controlId="postMedia" className="mb-3">
            <div
              className="border rounded d-flex flex-column align-items-center justify-content-center"
              style={{ height: "200px", borderStyle: "dashed" }}
            >
              <Form.Control
                type="file"
                multiple
                onChange={handleMediaChange}
                style={{ maxWidth: "200px" }}
              />
            </div>
            {mediaFiles.length > 0 && (
              <div className="mt-3">
                <strong>Uploaded Files:</strong>
                <ul>
                  {mediaFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </Form.Group>
        )}

        <div className="d-flex justify-content-between">
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Save Changes</Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditPost;
