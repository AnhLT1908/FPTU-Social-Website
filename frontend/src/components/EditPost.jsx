import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, Button, Dropdown, Tabs, Tab } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const EditPost = () => {
  const navigate = useNavigate();
  // Sử dụng state để quản lý dữ liệu bài đăng
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [post, setPost] = useState();
  const [selectedTab, setSelectedTab] = useState("text");
  const [mediaFiles, setMediaFiles] = useState([]);
  const { id } = useParams();
  const token = localStorage.getItem("token");
  // Sử dụng useEffect để load dữ liệu bài đăng ban đầu khi component được mount
  useEffect(() => {
    fetchPost();
  }, []);
  const fetchPost = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `http://localhost:9999/api/v1/posts/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setPost(response.data);
        setTitle(response?.data?.title);
        setBody(response?.data?.content);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleTabSelect = (key) => {
    setSelectedTab(key);
  };
  const handleChangePost = () => {
    let data = JSON.stringify({
      title: title,
      content: body,
    });

    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `http://localhost:9999/api/v1/posts/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        alert("Update success!!");
        window.location.href = `/post/${id}`;
      })
      .catch((error) => {
        console.log(error);
      });
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
          <Button variant="primary" onClick={() => handleChangePost()}>
            Save Changes
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditPost;
