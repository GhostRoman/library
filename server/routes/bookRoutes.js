const express = require('express');
const multer = require('multer');
const Book = require('../models/Book');
const authMiddleware = require('../middleware/authMiddleware');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;

const router = express.Router();

const upload = multer({
	dest: 'uploads/',
	fileFilter: (req, file, cb) => {
		if (file.mimetype === 'application/pdf') {
			cb(null, true);
		} else {
			cb(new Error('Only PDFs are allowed!'), false);
		}
	}
});

// Измените на относительный путь без полного URL
router.post('/upload', authMiddleware, upload.single('pdf'), async (req, res) => {
	try {
		const { title, author, genre, description } = req.body;

		const book = new Book({
			title,
			author,
			genre,
			description,
			pdfPath: req.file.path
		});

		await book.save();
		res.status(201).json(book);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Загрузка PDF файла по ID книги
router.get('/download/:id', authMiddleware, async (req, res) => {
	try {
		const book = await Book.findById(req.params.id);
		if (!book) {
			return res.status(404).json({ message: 'Book not found' });
		}
		res.download(book.pdfPath);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Редактирование информации о книге
router.put('/edit/:id', authMiddleware, async (req, res) => {
	try {
		const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!book) {
			return res.status(404).json({ message: 'Book not found' });
		}
		res.json(book);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Поиск книг по заголовку, автору или жанру
router.get('/search', async (req, res) => {
	try {
		const { query } = req.query;
		const books = await Book.find({
			$or: [
				{ title: { $regex: query, $options: 'i' } },
				{ author: { $regex: query, $options: 'i' } },
				{ genre: { $regex: query, $options: 'i' } }
			]
		});
		res.json(books);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Комментарии к книге
router.post('/:id/comment', authMiddleware, async (req, res) => {
	try {
		const book = await Book.findById(req.params.id);
		if (!book) {
			return res.status(404).json({ message: 'Book not found' });
		}
		book.comments.push({
			user: req.user._id,
			text: req.body.text
		});
		await book.save();
		res.status(201).json(book);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Получение книг по жанру
router.get('/genre/:genre', async (req, res) => {
	try {
		const books = await Book.find({ genre: req.params.genre });
		res.json(books);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

module.exports = router;
