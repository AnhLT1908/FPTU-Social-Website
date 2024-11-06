import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Form,
  Button,
  Tabs,
  Tab,
  FormSelect,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedTab, setSelectedTab] = useState("text");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [community, setCommunity] = useState([]);
  const [user, setUser] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9999/api/v1/communities/"
        );
        console.log("Communities", community)
        setCommunity(response.data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchCommunities();
  }, []);

  const handleCommunityChange = (e) => {
    setSelectedCommunity(e.target.value);
  };

  const handleTabSelect = (key) => {
    setSelectedTab(key);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", body);
    formData.append("communityId", selectedCommunity);
    Array.from(mediaFiles).forEach((file) => formData.append("images", file));

    try {
      const response = await axios.post(
        "http://localhost:9999/api/v1/posts/upload-images",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        navigate(`/community/${community.id}`);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    }
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
        <h2>Create post</h2>
      </div>

      <Form onSubmit={handleSubmit}>
        <FormSelect
          className="mb-3"
          style={{ width: "30%" }}
          value={selectedCommunity}
          onChange={handleCommunityChange}
          name="community"
          required
        >
          <option value="">Select a community</option>
          {community.map((c) => (
            <option key={c.id} value={c.id}>{`f/ ${c.name}`}</option>
          ))}
        </FormSelect>

        <Tabs
          activeKey={selectedTab}
          onSelect={handleTabSelect}
          className="mb-3"
        >
          <Tab eventKey="text" title="Text" />
          <Tab eventKey="images" title="Images & Video" />
        </Tabs>

        <Form.Group controlId="postTitle" className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={300}
            required
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
              required
            />
          </Form.Group>
        )}

        {selectedTab === "images" && (
          <Form.Group controlId="postMedia" className="mb-3">
            <Form.Label>Upload Images</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={(e) => setMediaFiles(Array.from(e.target.files))} // Convert to array
            />
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
          <Button variant="secondary" onClick={() => navigate("/")}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Post
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default CreatePost;
