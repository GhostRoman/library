const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, maxlength: 30 },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/, maxlength: 50 },
    password: { type: String, required: true },
    favoriteBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

// Хеширование пароля перед сохранением
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12); // Используем 12 как стоимость хеширования
    next();
});

// Метод для сравнения паролей
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);