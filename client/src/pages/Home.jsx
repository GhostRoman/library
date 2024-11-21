import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
    return (
        <div className="container">
            <h1 className="title">Welcome to Book Library</h1>
            <p className="description">
                Explore our vast collection of books and enjoy reading!
            </p>
            <img
                src="src/assets/image.jpg"
                alt="Bookshelf"
                className="home-image"
            />
            <Link to="/books" className="explore-button">Explore Books</Link>
        </div>
    );
}

export default Home;
