import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios for API requests
import './Profile.css';

function Profile() {
    const [user, setUser] = useState(null);
    const [favoriteBooks, setFavoriteBooks] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token'); // Get token from localStorage
                const response = await axios.get('http://localhost:3000/api/user/profile', {
                    headers: { Authorization: `Bearer ${token}` }, // Set token in headers
                });

                setUser(response.data.user); // Assume user data is returned as { user: { ... } }
                setFavoriteBooks(response.data.favoriteBooks); // Assume favorite books are returned in the same response
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchUserData(); // Call the fetch function
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Show loading while fetching data
    }

    if (!user) {
        return <div>User not found.</div>; // Handle case where user is not found
    }

    return (
        <div className="profile">
            <h1>User Profile</h1>
            <div className="user-info">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Joined:</strong> {user.joinDate}</p>
            </div>
            <h2>Favorite Books</h2>
            {favoriteBooks.length === 0 ? (
                <p>No favorite books found.</p> // Handle case where there are no favorite books
            ) : (
                <ul className="favorite-books">
                    {favoriteBooks.map((book) => (
                        <li key={book.id}>
                            <Link to={`/book/${book.id}`}>{book.title}</Link> by {book.author}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Profile;
