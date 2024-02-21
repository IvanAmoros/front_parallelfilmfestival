// Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';



function Navbar() {
	const { isLoggedIn, logout, user } = useAuth();
	const [showDropdown, setShowDropdown] = useState(false);
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
							{user.username}
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
				<li>
					<a href="https://www.linkedin.com/in/ivan-amoros-prados/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
						<img src={`${process.env.PUBLIC_URL}/images/LinkedIn_icon.png`} alt="LinkedIn" style={{ marginRight: '5px', width: '20px', height: '20px' }} />
					</a>
				</li>
				<li>
					<a href="https://github.com/IvanAmoros" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
						<img src={`${process.env.PUBLIC_URL}/images/github-icon.png`} alt="GitHub" style={{ marginRight: '5px', width: '20px', height: '20px' }} />
					</a>
				</li>
			</ul>
		</nav>
	);
}

export default Navbar;
