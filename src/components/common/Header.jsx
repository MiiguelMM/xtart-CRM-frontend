import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../xtartfp_logo.jpg'
const Header = () => {
  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo-container">
          <div className="logo">
            <img
              alt="Xtart Tech Solutions"
              className="logo-image"
              src={logo}
            />
          </div>
          <h1>
            <span className="company-name">XTART SOLUTIONS</span>
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;