import React, { useState } from 'react';
import axios from 'axios';

function CommentBook({ bookId }) {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Сбрасываем ошибку перед отправкой
    setSuccess(''); // Сбрасываем предыдущее сообщение о успехе
    try {
      // Добавляем заголовок Authorization для аутентификации
      const token = localStorage.getItem('token'); // Получаем токен из localStorage
      await axios.post(`/api/books/${bookId}/comment`, { text: comment }, {
        headers: {
          Authorization: `Bearer ${token}` // Передаем токен в заголовке
        }
      });
      setSuccess('Comment added successfully!');
      setComment(''); // Очищаем текстовое поле после успешного добавления
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Error adding comment. Please try again.');
    }
  };

  return (
      <div>
        <form onSubmit={handleSubmit}>
        <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
            required
        />
          <button type="submit">Add Comment</button>
        </form>
        {success && <p style={{ color: 'green' }}>{success}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
  );
}

export default CommentBook;
