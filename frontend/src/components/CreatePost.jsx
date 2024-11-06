import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Form,
  Button,
  Tabs,
  Tab,
  FormSelect,
  FormControl,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreatePost = ({ communityData = null }) => {
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
      console.log("User data:", userData);
    }
  }, []);

  useEffect(() => {
    if (communityData == null) {
      const fetchCommunities = async () => {
        try {
          const response = await axios.get(
            "http://localhost:9999/api/v1/communities/"
          );
          setCommunity(response.data);
          console.log("Community:", response.data);
        } catch (error) {
          console.error("Fetch error:", error);
        }
      };

      fetchCommunities();
    } else {
      setSelectedCommunity(communityData?.id);
    }
  }, []);

  const handleCommunityChange = (e) => {
    setSelectedCommunity(e.target.value);
  };

  const handleTabSelect = (key) => {
    setSelectedTab(key);
  };

  const handleMediaChange = (e) => {
    setMediaFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the post data object
    const data = {
      title: title,
      content: body,
      communityId: selectedCommunity,
      userId: user.id,
      media: mediaFiles, // Assuming you want to send file names or additional info
    };

    try {
      const response = await axios.post(
        "http://localhost:9999/api/v1/posts/",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in headers
          },
        }
      );

      if (response.status === 201) {
        window.location.href = `/community/${selectedCommunity}`; // Redirect on success
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
        {communityData == null && (
          <FormSelect
            className="mb-3"
            style={{ width: "30%" }}
            value={selectedCommunity}
            onChange={handleCommunityChange}
            name="community"
            required
          >
            <option value="">Select a community</option>
            {community?.map((c) => (
              <option key={c.id} value={c.id}>{`f/ ${c.name}`}</option>
            ))}
          </FormSelect>
        )}

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
            name="title"
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
              name="content"
              required
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
