import React, { useState } from 'react';
import './ResetPassword.css';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    // Простая валидация электронной почты
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Пожалуйста, введите действительный адрес электронной почты.');
      return;
    }

    setError(''); // Сбрасываем сообщение об ошибке
    setLoading(true); // Устанавливаем состояние загрузки

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Письмо с инструкциями по сбросу пароля отправлено на ваш адрес электронной почты.');
      } else {
        throw new Error(data.message || 'Неизвестная ошибка');
      }
    } catch (error) {
      setMessage('Произошла ошибка. Пожалуйста, попробуйте еще раз.');
      console.error('Reset password failed:', error);
    } finally {
      setLoading(false); // Останавливаем состояние загрузки
    }
  };

  return (
      <div className="reset-password">
        <h2>Сброс пароля</h2>
        {error && <p className="error">{error}</p>}
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Отправка...' : 'Сбросить пароль'}
          </button>
        </form>
      </div>
  );
}

export default ResetPassword;