// HomeNavbar.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './HomeNavbar.css';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

function HomeNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Navbar Start */}
      <nav
        className="navbar navbar-expand-lg bg-secondary navbar-dark sticky-top py-lg-0 px-lg-5 wow fadeIn"
        data-wow-delay="0.1s"
      >
        <a href="/" className="navbar-brand ms-4 ms-lg-0">
          <img src="./img/logo.png" alt="Formula 1 Fan Hub Logo" className="logo" />
          <h1 className="mb-0 text-primary text-uppercase">Formula 1 Fan Hub</h1>
        </a>
        <button
          type="button"
          className="navbar-toggler me-4"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <div className="navbar-nav ms-auto p-4 p-lg-0">
            <a href="/" className="nav-item nav-link active">
              Home
            </a>
            <a href="/About" className="nav-item nav-link">
              About
            </a>
            <a href="/" className="nav-item nav-link">
              Service
            </a>
            <div className="nav-item dropdown">
              <a
                href="#"
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                Pages{' '}
              </a>
              <div className="dropdown-menu m-0">
                <a href="/" className="dropdown-item">
                  Drivers
                </a>
                <a href="/" className="dropdown-item">
                  Race Fixtures
                </a>
                <a href="/" className="dropdown-item">
                  Team members
                </a>
                <a href="/" className="dropdown-item">
                  Team History
                </a>
                <a href="/" className="dropdown-item">
                  F1 History
                </a>
              </div>
            </div>
            <a href="/Signin" className="nav-item nav-link">
              Login
            </a>
          </div>
          <a
            href="/Signup"
            className="btn btn-primary rounded-0 py-2 px-lg-4 d-none d-lg-block"
          >
            SignUp Now <i className="fa fa-arrow-right ms-3" />{' '}
          </a>
        </div>
      </nav>
      {/* Navbar End */}
    </>
  );
}

export default HomeNavbar;
