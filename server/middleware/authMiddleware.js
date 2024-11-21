const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        // Проверяем наличие заголовка Authorization
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).send({ error: 'Authorization token is required.' });
        }

        // Извлекаем токен
        const bearerToken = token.replace('Bearer ', '');
        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);

        // Ищем пользователя
        const user = await User.findOne({ _id: decoded.userId });
        if (!user) {
            return res.status(401).send({ error: 'User not found.' });
        }

        // Присваиваем токен и пользователя в объект запроса
        req.token = bearerToken;
        req.user = user;
        next();
    } catch (error) {
        // Обработка ошибок валидации токена
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).send({ error: 'Invalid token.' });
        }
        res.status(401).send({ error: 'Please authenticate.' });
    }
};
