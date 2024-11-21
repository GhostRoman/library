import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import './BookList.css';

const dummyBooks = [
  { id: 1, title: '1984', author: 'George Orwell', genre: 'Dystopian', description: 'A novel about totalitarianism.' },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', description: 'A novel about racial injustice.' },
  { id: 3, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic', description: 'A story of the Jazz Age.' },
  { id: 4, title: 'Moby Dick', author: 'Herman Melville', genre: 'Adventure', description: 'A novel about the quest for revenge against a whale.' },
];

function BookList() {
  const [books, setBooks] = useState(dummyBooks);
  const [filteredBooks, setFilteredBooks] = useState(dummyBooks);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("/api/books");
      const booksData = Array.isArray(response.data) ? response.data : [];
      if (booksData.length > 0) {
        setBooks(booksData);
        setFilteredBooks(booksData);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleSearch = (searchTerm) => {
    const filtered = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  const handleChange = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('pdf', file);
    Object.keys(newBook).forEach(key => formData.append(key, newBook[key]));

    try {
      await axios.post(`/api/books/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Book added successfully!');
      await fetchBooks();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  return (
      <div className="book-list">
        <h1>Book List</h1>
        <SearchBar onSearch={handleSearch} />
        <button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add New Book'}
        </button>

        {showAddForm && (
            <form onSubmit={handleSubmit}>
              <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
              <input type="text" name="author" placeholder="Author" onChange={handleChange} required />
              <input type="text" name="genre" placeholder="Genre" onChange={handleChange} required />
              <textarea name="description" placeholder="Description" onChange={handleChange} required />
              <input type="file" onChange={handleFileChange} required />
              <button type="submit">Add Book</button>
            </form>
        )}

        <div className="book-grid">
          {Array.isArray(filteredBooks) && filteredBooks.map((book) => (
              <div className="book-card" key={book.id}>
                <h2>{book.title}</h2>
                <p>{book.author}</p>
                <Link to={`/book/${book.id}`} className="learn-more-btn">Learn More</Link>
              </div>
          ))}
        </div>
      </div>
  );
}

export default BookList;