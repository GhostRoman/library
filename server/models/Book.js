const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true, index: true },
    author: { type: String, required: true, index: true },
    genre: { type: String, required: true, index: true },
    description: { type: String, maxlength: 1000 },
    pdfPath: { type: String, match: /^[\w,\s-]+\.[A-Za-z]{3}$/ },
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, maxlength: 500 },
        createdAt: { type: Date, default: Date.now, immutable: true }
    }]
});

module.exports = mongoose.model('Book', bookSchema);
