// Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import useAuth hook

function Navbar() {
  const { isLoggedIn, logout, user } = useAuth(); // Assuming 'user' holds the authenticated user's info
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown state

  // Toggle dropdown menu
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {isLoggedIn ? (
          <li style={{ position: 'relative' }}>
            <button onClick={toggleDropdown}>
              {user.username} {/* Safely display the username or a default string */}
            </button>
            {showDropdown && (
              <div style={{ position: 'absolute', top: '100%', right: 0, backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px', padding: '10px' }}>
                <button onClick={logout}>Logout</button>
              </div>
            )}
          </li>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
