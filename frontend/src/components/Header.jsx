import React, { useEffect, useState } from "react";
import "../styles/header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link } from "react-router-dom";
import { searchCommunities, searchUsers } from "../services/SearchService";
import { listNotifications } from "../services/NotificationService";

function Header({ socket }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("user");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [noResultsMessage, setNoResultsMessage] = useState("");
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const data = await listNotifications();
    setNotifications(data);
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
      console.log("User: ", userData);
    } else {
      // Redirect to login page if no user is found in localStorage
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    socket.on("newNotification", (data) => {
      console.log("New notice: ", data);
      if (user?.id === data?.userId) setNotifications((prev) => [...prev, data]);
    });
    return () => {
      socket.off("newNotification");
    };
  }, [socket, user]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSearch = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const newTimeout = setTimeout(async () => {
      if (searchQuery.length > 2) {
        try {
          let results;
          let message = "";

          if (searchType === "user") {
            const response = await searchUsers(searchQuery);
            results = response.data;

            if (response.results === 0) {
              // Thay đổi thông báo cho user
            }
          } else {
            const response = await searchCommunities(searchQuery);
            results = response.data;

            if (response.results === 0) {
              // Handle no results case
            }
          }

          setSearchResults(results);
          setIsDropdownVisible(true);
          setNoResultsMessage(message);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      } else {
        setSearchResults([]);
        setIsDropdownVisible(false);
        setNoResultsMessage("");
      }
    }, 2000);

    setSearchTimeout(newTimeout);
  };

  const handleResultClick = (result) => {
    console.log("Selected result:", result);
    setQuery(result.name || result.username);
    setIsDropdownVisible(false);

    if (searchType === "user") {
      navigate(`/profile/${result._id}`);
    } else if (searchType === "community") {
      navigate(`/community/${result._id}`);
    }
  };

  return (
    <nav className="d-flex px-md-2 align-items-center header-navbar">
      <Link to="/" className="nav-logo m-0">
        <img src="/images/logo.jpg" width={50} alt="Logo" />
      </Link>
      <div className="search-bar-section d-flex flex-grow-1 justify-content-stretch py-2">
        <div className="d-flex justify-content-stretch mx-xl-auto d-xl-block">
          <div className="search-bar-wrapper position-relative">
            <div className="search-icon">
              <svg
                aria-hidden="true"
                fill="currentColor"
                height="16"
                width="16"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19.5 18.616 14.985 14.1a8.528 8.528 0 1 0-.884.884l4.515 4.515.884-.884ZM1.301 8.553a7.253 7.253 0 1 1 7.252 7.253 7.261 7.261 0 0 1-7.252-7.253Z"></path>
              </svg>
            </div>
            <form
              className="search-form d-flex align-items-center"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="text"
                placeholder="Search"
                id="search"
                autoComplete="off"
                value={query}
                onChange={handleSearch}
                onFocus={() => setIsDropdownVisible(searchResults.length > 0)}
                className="flex-grow-1"
              />
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="search-type-dropdown"
              >
                <option value="user">User</option>
                <option value="community">Community</option>
              </select>
            </form>
            {isDropdownVisible && (
              <ul className="search-results-dropdown">
                {searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <li
                      key={result._id || result.id}
                      className="search-result-item"
                      onClick={() => handleResultClick(result)}
                    >
                      {result.message ? ( // Kiểm tra xem có thông báo không
                        <span className="no-results-message">
                          {result.message}
                        </span>
                      ) : (
                        <>
                          {searchType === "user" ? (
                            <>
                              <img
                                src={result.avatar || "default.jpg"}
                                alt="Avatar"
                                className="result-avatar"
                                width="20"
                                height="20"
                              />
                              <span>{result.username}</span> -{" "}
                              <span>{result.email}</span>
                            </>
                          ) : (
                            <>
                              <img
                                src={result.logo || "default.jpg"}
                                alt="Logo"
                                className="result-logo"
                                width="20"
                                height="20"
                              />
                              <span>{result.name}</span> -{" "}
                              <span>{result.description}</span>
                            </>
                          )}
                        </>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="no-results-message">Không có kết quả nào</li> // Hiển thị thông báo không có kết quả
                )}
              </ul>
            )}

            {/* Hiển thị thông báo không có kết quả */}
            {noResultsMessage && (
              <div className="no-results-message">{noResultsMessage}</div>
            )}
          </div>
        </div>
      </div>
      <div className="header-right-section">
        {/* As Guest */}
        {!user ? (
          <Link to="/login" className="login-button">
            Log In
          </Link>
        ) : (
          <div className="d-flex">
            <div className="tools-wrapper">
              <button
                className="create-button"
                onClick={() => navigate("/create-post")}
              >
                <span className="d-flex align-items-center justify-content-center">
                  <span className="d-flex me-2">
                    <svg
                      fill="currentColor"
                      height="20"
                      viewBox="0 0 20 20"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M19 9.375h-8.375V1h-1.25v8.375H1v1.25h8.375V19h1.25v-8.375H19v-1.25Z"></path>
                    </svg>
                  </span>
                  <span>Create</span>
                </span>
              </button>
              <div className="dropdown notification-section d-flex align-items-center justify-content-center">
                <button
                  className="btn dropdown-toggle notification-btn"
                  type="button"
                  id="dropdownMenuButton2"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  data-bs-auto-close="outside"
                >
                  <span className="d-flex justify-content-center align-items-center">
                    <svg
                      fill="currentColor"
                      height="20"
                      viewBox="0 0 20 20"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M18 16v-4l-1.5-2V7.5a4.5 4.5 0 1 0-9 0v1.5L2 12v4h16Zm-7-4h-2v4H7v-4H5v-2h2V7.5a2.5 2.5 0 0 1 5 0v4h2v2h-2v4Z"></path>
                    </svg>
                  </span>
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton2"
                >
                  {notifications.map((notification, idx) => (
                    <li key={idx}>
                      <a
                        className="dropdown-item"
                        href="#!"
                      >
                        {notification.message}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className="dropdown dropdown-toggle profile-btn"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={user.avatar || "/images/default-avatar.jpg"}
                  alt="Avatar"
                  className="profile-img"
                  width="32"
                  height="32"
                />
              </div>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li>
                  <Link to={`/profile/${user._id}`} className="dropdown-item">
                    Profile
                  </Link>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Header;
