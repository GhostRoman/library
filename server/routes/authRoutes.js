const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const emailService = require('../services/emailService');

const router = express.Router();

// Регистрация нового пользователя
router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();

        // Генерация токена для подтверждения
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        // Отправка письма с подтверждением
        await emailService.sendConfirmationEmail(user.email, user.username, token);

        res.status(201).json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Подтверждение учетной записи пользователя
router.get('/confirm/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(400).json({ message: 'Недействительный токен.' });
        }

        user.isConfirmed = true; // Убедитесь, что это поле существует в вашей модели
        await user.save();

        res.status(200).json({ message: 'Учетная запись подтверждена! Теперь вы можете войти.' });
    } catch (error) {
        res.status(400).json({ message: 'Ошибка подтверждения учетной записи: ' + error.message });
    }
});

// Вход пользователя
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // Проверка наличия пользователя и корректности пароля
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: 'Неверные учетные данные' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Example Express route
router.get('/user/profile', async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('favoriteBooks');
        res.json({ user, favoriteBooks: user.favoriteBooks });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// Запрос на сброс пароля
router.post('/reset-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 час
        await user.save();
        await emailService.sendPasswordResetEmail(user.email, token);

        res.json({ message: 'Письмо для сброса пароля отправлено' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Сброс пароля по токену
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Поиск пользователя по токену и сроку действия
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Недействительный или просроченный токен' });
        }

        // Установка нового пароля
        user.password = password;
        user.resetPasswordToken = undefined; // Убираем токен
        user.resetPasswordExpires = undefined; // Убираем срок действия
        await user.save();

        res.json({ message: 'Пароль успешно сброшен' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
