const { model, Schema } = require('mongoose');

const userSchema = new Schema({
	username: { type: String, required: true, trim: true },
	password: { type: String, required: true },
});

const User = model('User', userSchema);
module.exports = User;
