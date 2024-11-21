import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './BookDetails.css';
import DownloadBook from '../components/DownloadBook';
import EditBook from '../components/EditBook';
import CommentBook from '../components/CommentBook';

function BookDetails() {
  const [book, setBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`/api/books/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    };
    fetchBook();
  }, [id]);

  if (!book) {
    return <div className="loading">Loading...</div>;
  }

  const handleSave = (updatedBook) => {
    setBook(updatedBook);
    setIsEditing(false);
  };

  return (
      <div className="book-details">
        <div className="book-info">
          {isEditing ? (
              <EditBook
                  bookId={id}
                  book={book}
                  onSave={handleSave}
              />
          ) : (
              <>
                <h1 className="book-title">{book.title}</h1>
                <h2 className="book-author">by {book.author}</h2>
                <p className="book-metadata"><strong>Genre:</strong> {book.genre}</p>
                <p className="book-metadata"><strong>Published:</strong> {book.publishedDate}</p>
                <p className="book-description">{book.description}</p>
                <div className="book-actions">
                  <button className="btn favorite-button">Add to Favorites</button>
                  <DownloadBook bookId={id} />
                  <button className="btn edit-button" onClick={() => setIsEditing(true)}>Edit Book</button>
                </div>
              </>
          )}
        </div>

        <div className="book-comments">
          <h3>Comments</h3>
          <CommentBook bookId={id} />

          <div className="comments-list">
            {book.comments && book.comments.map((comment, index) => (
                <div key={index} className="comment">
                  <p className="comment-text">{comment.text}</p>
                  <small className="comment-author">By: {comment.user.username}</small>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
}

export default BookDetails;
