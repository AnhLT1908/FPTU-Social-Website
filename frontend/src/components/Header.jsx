import React, { useEffect, useState } from 'react';
import '../styles/header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsisVertical,
  faMessage,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import { searchCommunities, searchUsers } from '../services/SearchService';
import { listNotifications } from '../services/NotificationService';
function Header({ socket }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('user');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [noResultsMessage, setNoResultsMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const fetchNotifications = async () => {
    const data = await listNotifications();
    setNotifications(data);
  };
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      console.log('User: ', userData);
    }
  }, []);

  useEffect(() => {
    socket.on('newNotification', (data) => {
      console.log('New notice: ', data);
      if (user?.id == data?.userId) setNotifications((prev) => [...prev, data]);
    });
    return () => {
      socket.off('newNotification');
    };
  }, [socket]);
  useEffect(() => {
    fetchNotifications();
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
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
          let message = '';

          if (searchType === 'user') {
            const response = await searchUsers(searchQuery);
            results = response.data;

            if (response.results === 0) {
              // Thay đổi thông báo cho user
            }
          } else {
            const response = await searchCommunities(searchQuery);
            results = response.data;

            if (response.results === 0) {
            }
          }

          setSearchResults(results);
          setIsDropdownVisible(true);
          setNoResultsMessage(message);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      } else {
        setSearchResults([]);
        setIsDropdownVisible(false);
        setNoResultsMessage('');
      }
    }, 2000);

    setSearchTimeout(newTimeout);
  };

  const handleResultClick = (result) => {
    console.log('Selected result:', result);
    setQuery(result.name || result.username);
    setIsDropdownVisible(false);

    if (searchType === 'user') {
      navigate(`/profile/${result._id}`);
    } else if (searchType === 'community') {
      navigate(`/community/${result._id}`);
    }
  };

  return (
    <nav className="d-flex px-md-2 align-items-center header-navbar">
      <Link
        to="/"
        className="nav-logo m-0"
      >
        <img
          src="/images/logo.jpg"
          width={50}
          alt="Logo"
        />
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
                          {searchType === 'user' ? (
                            <>
                              <img
                                src={result.avatar || 'default.jpg'}
                                alt="Avatar"
                                className="result-avatar"
                                width="20"
                                height="20"
                              />
                              <span>{result.username}</span> -{' '}
                              <span>{result.email}</span>
                            </>
                          ) : (
                            <>
                              <img
                                src={result.logo || 'default.jpg'}
                                alt="Logo"
                                className="result-logo"
                                width="20"
                                height="20"
                              />
                              <span>{result.name}</span> -{' '}
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
          <Link
            to="/login"
            className="login-button"
          >
            Log In
          </Link>
        ) : (
          <div className="d-flex">
            <div className="tools-wrapper">
              <button
                className="create-button"
                onClick={() => navigate('/create-post')}
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
                      <path d="M11 18h1a2 2 0 0 1-4 0h3Zm8-3.792v.673A1.12 1.12 0 0 1 17.883 16H2.117A1.12 1.12 0 0 1 1 14.881v-.673a3.947 3.947 0 0 1 1.738-3.277A2.706 2.706 0 0 0 3.926 8.7V7.087a6.07 6.07 0 0 1 12.138 0l.01 1.613a2.7 2.7 0 0 0 1.189 2.235A3.949 3.949 0 0 1 19 14.208Zm-1.25 0a2.7 2.7 0 0 0-1.188-2.242A3.956 3.956 0 0 1 14.824 8.7V7.088a4.819 4.819 0 1 0-9.638 0v1.615a3.956 3.956 0 0 1-1.738 3.266 2.7 2.7 0 0 0-1.198 2.239v.542h15.5v-.542Z"></path>
                    </svg>
                  </span>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="dropdownMenuButton2"
                >
                  <div className="notification-header text-center py-1 mb-2 border-bottom border-primary border-2">
                    Notifications
                  </div>
                  <div className="notification-content">
                    {/* Repeat Notification Items Here */}
                    {notifications.map((_, index) => (
                      <li
                        className="d-flex"
                        key={index}
                      >
                        <a
                          className="dropdown-item-notification"
                          href="#"
                        >
                          <span className="dropdown-item-icon">
                            <FontAwesomeIcon icon={faMessage} />
                          </span>
                          <span className="dropdown-item-name d-flex flex-column">
                            <span className="notification-activity">
                              This user replied to your comment in
                              r/test-community
                            </span>
                            <span className="notification-hints max-lines">
                              Go see your comments on r/test-community: "This is
                              just to test limited words length"
                            </span>
                          </span>
                        </a>
                        <button>
                          <span>
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                          </span>
                        </button>
                      </li>
                    ))}
                    {/* <a
                      tabIndex="0"
                      className="btn btn-lg btn-danger"
                      role="button"
                      data-bs-toggle="popover"
                      data-bs-trigger="focus"
                      title="Dismissible popover"
                      data-bs-content="And here's some amazing content. It's very engaging. Right?"
                    >
                      Dismissible popover
                    </a> */}
                  </div>
                </ul>
              </div>
            </div>
            <div className="profile-settings">
              <div className="dropdown">
                <button
                  className="btn dropdown-toggle profile-btn"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="d-flex justify-content-center align-items-center">
                    <img
                      src="/images/logo.jpg"
                      width={32}
                      height={32}
                      style={{ borderRadius: '50%' }}
                      alt="User Avatar"
                    />
                  </span>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                    >
                      <span className="dropdown-item-icon">
                        <img
                          src="/images/logo.jpg"
                          alt="User Avatar for u/sjdkdk48"
                        />
                      </span>
                      <Link to={`/profile/${user.id}`}>
                        <span className="dropdown-item-name d-flex flex-column">
                          <span>View Profile</span>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              lineHeight: '1rem',
                              color: 'var(--color-secondary-weak)',
                            }}
                          >
                            {'u/' + user?.username}
                          </span>
                        </span>
                      </Link>
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={handleLogout}
                    >
                      <span className="dropdown-item-icon">
                        <svg
                          fill="currentColor"
                          height="16"
                          width="16"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M10 3v2h5v10h-5v2h5a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-5Zm2 12v-2h-2v2h2Z"></path>
                          <path d="M5 1H3v3h2V2h2V1H5Zm0 14H3v3h2v-1h2v-2H5Zm3-5H1v2h7v-2Zm0-5H1v2h7V7Zm1-3H1v2h8V4Z"></path>
                        </svg>
                      </span>
                      <span>Log out</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Header;
