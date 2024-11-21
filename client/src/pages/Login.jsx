import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom'; // Change this line

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // Для состояния загрузки
  const navigate = useNavigate(); // Change this line

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Устанавливаем состояние загрузки

    // Отправка данных на сервер для аутентификации
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Неверные учетные данные');
      }

      const data = await response.json();
      console.log('Login successful:', data);
      setSuccess('Вы успешно вошли в систему!');
      setError(''); // Очистить сообщение об ошибке

      // Сохранение токена в localStorage
      localStorage.setItem('token', data.token);

      // Очистить поля формы
      setEmail('');
      setPassword('');

      // Перенаправление на домашнюю страницу или страницу с книгами
      navigate('/books'); // Change this line
    } catch (error) {
      console.error('Login failed:', error);
      setError('Ошибка входа: ' + error.message);
      setSuccess(''); // Очистить сообщение об успехе
    } finally {
      setLoading(false); // Сбрасываем состояние загрузки
    }
  };

  return (
      <div className="container">
        <h1 className="title">Login</h1>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="label">Email Address</label>
            <input
                type="email"
                id="email"
                name="email"
                className="input"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="label">Password</label>
            <input
                type="password"
                id="password"
                name="password"
                className="input"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
  );
}

export default Login;
