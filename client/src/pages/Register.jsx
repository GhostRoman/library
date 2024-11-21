import React, { useState } from 'react';
import './Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Отправка данных на сервер
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        throw new Error('Ошибка регистрации');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      setSuccess('Пользователь зарегистрирован успешно!');
      setError(''); // Очистить сообщение об ошибке

      // Очистить поля формы
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Registration failed:', error);
      setError('Ошибка регистрации: ' + error.message);
      setSuccess(''); // Очистить сообщение об успехе
    }
  };

  return (
      <div className="container">
        <h1 className="title">Register</h1>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="label">Username</label>
            <input
                type="text"
                id="username"
                name="username"
                className="input"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
          </div>
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
          <button type="submit" className="button">Register</button>
        </form>
      </div>
  );
}

export default Register;
