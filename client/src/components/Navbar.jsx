import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const isLoggedIn = false; // Замените на реальную проверку аутентификации

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Book Library</Link>
            </div>
            <div className="navbar-menu">
                <Link to="/books">Books</Link>
                {isLoggedIn ? (
                    <>
                        <Link to="/favorites">Favorites</Link>
                        <Link to="/profile">Profile</Link>
                        <Link to="/logout">Logout</Link>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
