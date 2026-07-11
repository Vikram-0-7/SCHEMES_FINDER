import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer__container container">
        <div className="footer__grid">
          {/* Brand Column */}
          <div className="footer__brand">
            <div className="footer__brand-icon">
              <Building2 size={24} />
            </div>
            <p className="footer__brand-desc">
              Empowering citizens by simplifying access to government welfare schemes,
              entitlements, and legal rights through technology and clear information.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <Link to="/schemes" className="footer__link">Browse Schemes</Link>
            <Link to="/legal-helper" className="footer__link">Legal Assistant</Link>
            <Link to="/about" className="footer__link">About Us</Link>
            <a href="#" className="footer__link">Accessibility Statement</a>
          </div>

          {/* Categories */}
          <div className="footer__col">
            <Link to="/schemes?category=Agriculture" className="footer__link">Agriculture</Link>
            <Link to="/schemes?category=Education" className="footer__link">Education</Link>
            <Link to="/schemes?category=Health" className="footer__link">Health & Wellness</Link>
            <Link to="/schemes?category=Housing" className="footer__link">Housing</Link>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {new Date().getFullYear()} Schemes Made Simple. All rights reserved.
          </p>
          <div className="footer__bottom-links">
            <a href="#" className="footer__bottom-link">Privacy Policy</a>
            <a href="#" className="footer__bottom-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
