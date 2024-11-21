import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditBook({ bookId }) {
  const [book, setBook] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`/api/books/${bookId}`);
        setBook(response.data);
      } catch (error) {
        console.error('Error fetching book:', error);
        setError('Error fetching book. Please try again.'); // Устанавливаем сообщение об ошибке
      } finally {
        setLoading(false); // Завершаем загрузку
      }
    };
    fetchBook();
  }, [bookId]);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Сбрасываем предыдущее сообщение об ошибке
    try {
      await axios.put(`/api/books/edit/${bookId}`, book);
      alert('Book updated successfully!');
    } catch (error) {
      console.error('Error updating book:', error);
      setError('Error updating book. Please try again.'); // Устанавливаем сообщение об ошибке
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Показать индикатор загрузки
  }

  return (
      <form onSubmit={handleSubmit}>
        <input
            type="text"
            name="title"
            value={book.title}
            onChange={handleChange}
            placeholder="Title"
            required
        />
        <input
            type="text"
            name="author"
            value={book.author}
            onChange={handleChange}
            placeholder="Author"
            required
        />
        <input
            type="text"
            name="genre"
            value={book.genre}
            onChange={handleChange}
            placeholder="Genre"
            required
        />
        <textarea
            name="description"
            value={book.description}
            onChange={handleChange}
            placeholder="Description"
            required
        />
        <button type="submit">Update Book</button>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Отображение ошибок */}
      </form>
  );
}

export default EditBook;
