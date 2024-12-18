import React from 'react';
import { Building2 } from 'lucide-react';
import '../Css/Login.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <Building2 className="footer-logo-icon" />
          <span className="footer-logo-text">Ouro Bank</span>
        </div>
        <p className="footer-copyright">© 2024 Ouro Bank. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
