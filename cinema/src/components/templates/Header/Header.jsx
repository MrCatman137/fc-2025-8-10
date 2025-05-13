import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Header.css';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/check-auth", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setIsAuthenticated(data.authenticated))
      .catch(() => setIsAuthenticated(false));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigate = useNavigate();

    const handleLogout = async () => {
    try {
        await fetch("http://localhost:5000/api/logout", {
      method: "POST",
      credentials: "include",
    });
    setIsAuthenticated(false);
    setMenuOpen(false);
    navigate("/"); 
  } catch (error) {
    console.error("Logout failed", error);
  }
};

  

  return (
    <header className="header">
      <Link to="/" className="logo">Home</Link>
      <div className="auth-container" ref={menuRef}>
        {isAuthenticated ? (
          <div className="avatar-wrapper">
            <img
              src="/avatar.png"
              alt="Avatar"
              className="avatar"
              onClick={() => setMenuOpen(!menuOpen)}
            />
            <div className={`dropdown-menu ${menuOpen ? "open" : ""}`}>
            <Link to="/tickets" className="dropdown-item" onClick={() => setMenuOpen(false)}>My tickets</Link>
            <button onClick={handleLogout} className="dropdown-item">Log out</button>
            </div>
          </div>
        ) : (
          <Link to="/auth" className="auth-button">Log in</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
