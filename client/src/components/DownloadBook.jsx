import React, { useState } from 'react';
import axios from 'axios';

function DownloadBook({ bookId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    setLoading(true); // Устанавливаем состояние загрузки
    setError(''); // Сбрасываем предыдущее сообщение об ошибке
    try {
      const response = await axios.get(`/api/books/download/${bookId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'book.pdf'); // Имя файла для сохранения
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link); // Удаляем ссылку после нажатия
    } catch (error) {
      console.error('Error downloading book:', error);
      setError('Error downloading book. Please try again.'); // Устанавливаем сообщение об ошибке
    } finally {
      setLoading(false); // Сбрасываем состояние загрузки
    }
  };

  return (
      <div>
        <button onClick={handleDownload} disabled={loading}>
          {loading ? 'Downloading...' : 'Download Book'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Отображение ошибок */}
      </div>
  );
}

export default DownloadBook;