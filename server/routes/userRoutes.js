const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

const router = express.Router();

// Добавление книги в избранное
router.post('/favorite/:bookId', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const bookId = req.params.bookId;

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ message: 'Invalid book ID' });
        }

        if (!user.favoriteBooks.includes(bookId)) {
            user.favoriteBooks.push(bookId);
            await user.save();
        }

        res.status(200).json(user.favoriteBooks);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

// Удаление книги из избранного
router.delete('/favorite/:bookId', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const bookId = req.params.bookId;

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ message: 'Invalid book ID' });
        }

        user.favoriteBooks = user.favoriteBooks.filter(id => id.toString() !== bookId);
        await user.save();

        res.status(200).json(user.favoriteBooks);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

// Получение списка избранных книг
router.get('/favorites', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('favoriteBooks');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.favoriteBooks);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;