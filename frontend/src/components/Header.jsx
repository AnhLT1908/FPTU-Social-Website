import React from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import '../styles/header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsisVertical,
  faMessage,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav className='d-flex px-md-2 align-items-center header-navbar'>
      <a href='/' className='nav-logo m-0'>
        <img href='/' src='/images/logo.jpg' width={50} />
      </a>
      <div className='search-bar-section d-flex flex-grow-1 justify-content-stretch py-2'>
        <div className='d-flex justify-content-stretch mx-xl-auto d-xl-block'>
          <div className='search-bar-wrapper'>
            <div className='search-icon'>
              <svg
                rpl=''
                aria-hidden='true'
                fill='currentColor'
                height='16'
                width='16'
                icon-name='search-outline'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M19.5 18.616 14.985 14.1a8.528 8.528 0 1 0-.884.884l4.515 4.515.884-.884ZM1.301 8.553a7.253 7.253 0 1 1 7.252 7.253 7.261 7.261 0 0 1-7.252-7.253Z'></path>
              </svg>
            </div>
            <form className='search-form'>
              <input
                type='text'
                placeholder='Search'
                id='search'
                autocomplete='off'
              />
            </form>
          </div>
        </div>
      </div>
      <div className='header-right-section'>
        {/* As Guest */}
        <Link to='/login' className='login-button'>Log In</Link>

        {/* As Logged in user */}
        <div className='tools-wrapper'>
          <button className='create-button'>
            <span className='d-flex align-items-center justify-content-center'>
              <span className='d-flex me-2'>
                <svg
                  rpl=''
                  fill='currentColor'
                  height='20'
                  icon-name='add-outline'
                  viewBox='0 0 20 20'
                  width='20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M19 9.375h-8.375V1h-1.25v8.375H1v1.25h8.375V19h1.25v-8.375H19v-1.25Z'></path>
                </svg>
              </span>
              <span>Create</span>
            </span>
          </button>
          <div className='dropdown notification-section d-flex align-items-center justify-content-center'>
            <button
              className='btn dropdown-toggle notification-btn'
              type='button'
              id='dropdownMenuButton2'
              data-bs-toggle='dropdown'
              aria-expanded='false'
              data-bs-auto-close='outside'
            >
              <span className='d-flex justify-content-center align-items-center'>
                <svg
                  rpl=''
                  fill='currentColor'
                  height='20'
                  icon-name='notification-outline'
                  viewBox='0 0 20 20'
                  width='20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M11 18h1a2 2 0 0 1-4 0h3Zm8-3.792v.673A1.12 1.12 0 0 1 17.883 16H2.117A1.12 1.12 0 0 1 1 14.881v-.673a3.947 3.947 0 0 1 1.738-3.277A2.706 2.706 0 0 0 3.926 8.7V7.087a6.07 6.07 0 0 1 12.138 0l.01 1.613a2.7 2.7 0 0 0 1.189 2.235A3.949 3.949 0 0 1 19 14.208Zm-1.25 0a2.7 2.7 0 0 0-1.188-2.242A3.956 3.956 0 0 1 14.824 8.7V7.088a4.819 4.819 0 1 0-9.638 0v1.615a3.956 3.956 0 0 1-1.738 3.266 2.7 2.7 0 0 0-1.198 2.239v.542h15.5v-.542Z'></path>
                </svg>
              </span>
            </button>
            <ul
              className='dropdown-menu dropdown-menu-end'
              aria-labelledby='dropdownMenuButton2'
            >
              <div className='notification-header text-center py-1 mb-2 border-bottom border-primary border-2'>
                Notifications
              </div>
              <div className='notification-content'>
                <li className='d-flex'>
                  <a className='dropdown-item-notification' href='#'>
                    <span className='dropdown-item-icon'>
                      <FontAwesomeIcon icon={faMessage} />
                    </span>
                    <span className='dropdown-item-name d-flex flex-column'>
                      <span className='notification-activity'>
                        This user replied to your comment in r/test-community
                      </span>
                      <span className='notification-hints max-lines'>
                        Go see your comments on r/test-community: "This is just
                        to test limited words length"
                      </span>
                    </span>
                  </a>
                  <button>
                    <span>
                      <FontAwesomeIcon icon={faEllipsisVertical} />
                    </span>
                  </button>
                </li>
                <li className='d-flex'>
                  <a className='dropdown-item-notification' href='#'>
                    <span className='dropdown-item-icon'>
                      <FontAwesomeIcon icon={faMessage} />
                    </span>
                    <span className='dropdown-item-name d-flex flex-column'>
                      <span className='notification-activity'>
                        This user replied to your comment in r/test-community
                      </span>
                      <span className='notification-hints max-lines'>
                        Go see your comments on r/test-community: "This is just
                        to test limited words length"
                      </span>
                    </span>
                  </a>
                  <button>
                    <span>
                      <FontAwesomeIcon icon={faEllipsisVertical} />
                    </span>
                  </button>
                </li>
                <li className='d-flex'>
                  <a className='dropdown-item-notification' href='#'>
                    <span className='dropdown-item-icon'>
                      <FontAwesomeIcon icon={faMessage} />
                    </span>
                    <span className='dropdown-item-name d-flex flex-column'>
                      <span className='notification-activity'>
                        This user replied to your comment in r/test-community
                      </span>
                      <span className='notification-hints max-lines'>
                        Go see your comments on r/test-community: "This is just
                        to test limited words length"
                      </span>
                    </span>
                  </a>
                  <button>
                    <span>
                      <FontAwesomeIcon icon={faEllipsisVertical} />
                    </span>
                  </button>
                </li>
                <a
                  tabindex='0'
                  className='btn btn-lg btn-danger'
                  role='button'
                  data-bs-toggle='popover'
                  data-bs-trigger='focus'
                  title='Dismissible popover'
                  data-bs-content="And here's some amazing content. It's very engaging. Right?"
                >
                  Dismissible popover
                </a>
              </div>
            </ul>
          </div>
        </div>
        <div className='profile-settings'>
          <div class='dropdown'>
            <button
              className='btn dropdown-toggle profile-btn'
              type='button'
              id='dropdownMenuButton1'
              data-bs-toggle='dropdown'
              aria-expanded='false'
            >
              <span className='d-flex justify-content-center align-items-center'>
                <img
                  src='/images/logo.jpg'
                  width={32}
                  height={32}
                  style={{ borderRadius: '624.9375rem' }}
                />
              </span>
            </button>
            <ul
              className='dropdown-menu dropdown-menu-end'
              aria-labelledby='dropdownMenuButton1'
            >
              <li>
                <a className='dropdown-item' href='#'>
                  <span className='dropdown-item-icon'>
                    <img
                      src='/images/logo.jpg'
                      alt='User Avatar for u/sjdkdk48'
                    />
                  </span>
                  <span className='dropdown-item-name d-flex flex-column'>
                    <span>View Profile</span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        lineHeight: '1rem',
                        color: 'var(--color-secondary-weak)',
                      }}
                    >
                      @username
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a className='dropdown-item' href='#'>
                  <span className='dropdown-item-icon'>
                    <svg
                      rpl=''
                      fill='currentColor'
                      height='20'
                      icon-name='logout-outline'
                      viewBox='0 0 20 20'
                      width='20'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path d='M11.991 10.625H1v-1.25h10.991l-1.933-1.933.884-.884 3 3a.624.624 0 0 1 0 .884l-3 3-.884-.884 1.933-1.933ZM15.375 1h-9.75A2.629 2.629 0 0 0 3 3.625v.792h1.25v-.792A1.377 1.377 0 0 1 5.625 2.25h9.75a1.377 1.377 0 0 1 1.375 1.375v12.75a1.377 1.377 0 0 1-1.375 1.375h-9.75a1.377 1.377 0 0 1-1.375-1.375v-.792H3v.792A2.63 2.63 0 0 0 5.625 19h9.75A2.63 2.63 0 0 0 18 16.375V3.625A2.63 2.63 0 0 0 15.375 1Z'></path>
                    </svg>
                  </span>
                  <span className='dropdown-item-name'>Log Out</span>
                </a>
              </li>
              <li>
                <a className='dropdown-item' href='#'>
                  Something else here
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
