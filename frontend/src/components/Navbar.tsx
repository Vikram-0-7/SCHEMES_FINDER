import { Link, useLocation } from 'react-router-dom';
import { useState, useContext } from 'react';
import { Building2, Menu, X, MessageSquare, User as UserIcon } from 'lucide-react';
import { AuthContext } from '../services/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const navLinks = [
    { to: '/home', label: 'Home' },
    { to: '/schemes', label: 'All Schemes' },
    { to: '/discover', label: 'Discover' },
    { to: '/legal-helper', label: 'Legal Helper' },
    { to: '/about', label: 'About' },
  ];

  return (
    <nav className="navbar" id="main-nav">
      <div className="navbar__container container">
        {/* Logo */}
        <Link to="/home" className="navbar__logo" id="nav-logo">
          <div className="navbar__logo-icon">
            <Building2 size={20} />
          </div>
          <div className="navbar__logo-text">
            <span className="navbar__logo-name">
              Schemes<span className="navbar__logo-accent">MadeSimple</span>
            </span>
            <span className="navbar__logo-subtitle">GOVT INITIATIVES</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar__links">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar__link ${location.pathname === link.to ? 'navbar__link--active' : ''}`}
              id={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="navbar__language">English</div>
        </div>

        {/* Top Right Actions */}
        <div className="navbar__actions">
          {user ? (
            <Link to="/profile" className="btn btn-outline navbar__cta">
              <UserIcon size={16} />
              My Profile
            </Link>
          ) : (
            <Link to="/login" className="btn btn-outline navbar__cta">
              <UserIcon size={16} />
              Login
            </Link>
          )}
          <Link to="/legal-helper" className="btn btn-primary navbar__cta" id="nav-ask-assistant">
            <MessageSquare size={16} />
            Ask Assistant
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="navbar__toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          id="nav-mobile-toggle"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="navbar__mobile">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar__mobile-link ${location.pathname === link.to ? 'navbar__mobile-link--active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <Link
              to="/profile"
              className={`navbar__mobile-link ${location.pathname === '/profile' ? 'navbar__mobile-link--active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              My Schemes
            </Link>
          ) : (
            <Link
              to="/login"
              className={`navbar__mobile-link ${location.pathname === '/login' ? 'navbar__mobile-link--active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>
          )}
          <Link
            to="/legal-helper"
            className="btn btn-primary btn-full"
            onClick={() => setMobileOpen(false)}
          >
            <MessageSquare size={16} />
            Ask Assistant
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
