import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <div className="mini-logo" />
          </div>
          <p>© 2025 Xtart Tech Solutions | Todos los derechos reservados</p>
          <p className="footer-motto">Innovación. Excelencia. Futuro.</p>
          <div className="footer-tech-line" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;