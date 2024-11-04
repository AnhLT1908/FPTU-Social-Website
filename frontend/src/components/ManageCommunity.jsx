import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Tabs, Tab, Table } from "react-bootstrap";
import axios from "axios";
const ManageCommunity = ({ showModal, setShowModal, community }) => {
  const [communityName, setCommunityName] = useState("");
  const [description, setDescription] = useState("");
  const [rule, setRule] = useState("");
  const [logo, setLogo] = useState("");
  const [type, setType] = useState("");
  const [joinRequests, setJoinRequests] = useState([]);
  const token = localStorage.getItem("token");
  // Sử dụng useEffect để cập nhật state khi có thông tin community mới
  useEffect(() => {
    if (community) {
      setCommunityName(community.name || "");
      setLogo(community.logo);
      setType(community.privacyType);
      setDescription(community.description || "");
      setRule(community.communityRule || "");
      setJoinRequests(community.joinRequests || []);
    }
  }, [community]);
  const handleAccpect = (id) => {
    let data = JSON.stringify({
      ids: [id],
    });

    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `http://localhost:9999/api/v1/communities/access/${community.id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        alert("Add user success!");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleCloseModal = () => setShowModal(false);
  const handleUpdate = () => {
    let data = JSON.stringify({
      name: communityName,
      description: description,
      communityRule: rule,
      privacyType: type,
      logo: logo,
    });

    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `http://localhost:9999/api/v1/communities/${community.id}`,
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
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Manage Community</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs
          defaultActiveKey="details"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          {/* Tab cho thông tin chi tiết */}
          <Tab eventKey="details" title="Details">
            <Form>
              <Form.Group controlId="communityName" className="mb-3">
                <Form.Label>
                  Community name <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter community name"
                  value={communityName}
                  onChange={(e) => setCommunityName(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="description" className="mb-3">
                <Form.Label>
                  Description <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="rule" className="mb-3">
                <Form.Label>Rule</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter Rule"
                  value={rule}
                  onChange={(e) => setRule(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={() => handleUpdate()}>
                Save Changes
              </Button>
            </Form>
          </Tab>
          <Tab eventKey="media" title="Media">
            <Form>
              <Form.Group controlId="communityName" className="mb-3">
                <Form.Label>
                  Logo <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter logo url"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="description" className="mb-3 ">
                <Form.Label>
                  Comunity Type <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <div className="mb-3 d-flex justify-content-between">
                  <Form.Check
                    type="radio"
                    label={
                      <>
                        <strong>Public</strong>
                      </>
                    }
                    name="communityType"
                    value="public"
                    checked={type === "public"}
                    onChange={() => setType("public")}
                    id="public"
                    className="me-3" // Cách thêm khoảng cách bên phải giữa các radio
                  />

                  <Form.Check
                    type="radio"
                    label={
                      <>
                        <strong>Restricted</strong>
                      </>
                    }
                    name="communityType"
                    value="restricted"
                    checked={type === "restricted"}
                    onChange={() => setType("restricted")}
                    id="restricted"
                    className="me-3" // Cách thêm khoảng cách bên phải giữa các radio
                  />

                  <Form.Check
                    type="radio"
                    label={
                      <>
                        <strong>Private</strong>
                      </>
                    }
                    name="communityType"
                    value="private"
                    checked={type === "private"}
                    onChange={() => setType("private")}
                    id="private"
                  />
                </div>
              </Form.Group>

              <Button variant="primary" onClick={() => handleUpdate()}>
                Save Changes
              </Button>
            </Form>
          </Tab>
          {/* Tab cho Join Requests */}
          <Tab eventKey="request" title="Join Requests">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Reason</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {joinRequests.length > 0 ? (
                  joinRequests.map((request, index) => (
                    <tr key={request?.userId}>
                      <td>{index + 1}</td>
                      <td>{request?.reason}</td>
                      <td>
                        <Button onClick={() => handleAccpect(request?._id)}>
                          Accept
                        </Button>
                      </td>{" "}
                      {/* Thêm trường trạng thái nếu có */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No join requests available
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ManageCommunity;
