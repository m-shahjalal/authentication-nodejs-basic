const router = require('express').Router();
const User = require('./UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { saltRounds, secret } = process.env;

router.post('/register', async (req, res) => {
	const { username, password } = req.body;
	const re =
		/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

	if (!username || !password) {
		return res
			.status(401)
			.json({ error: 'username and password must be provided' });
	}

	if (!re.test(username)) {
		return res.status(401).json({ error: 'email must be valid' });
	}

	try {
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(200).json({ message: 'user already exists' });
		}

		const hashPasswords = await bcrypt.hash(password, saltRounds);

		const user = await User.create({
			username: username,
			password: hashPasswords,
		});
	} catch (error) {
		console.log(error.message);
	}
});

router.post('/login', async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res
				.status(403)
				.json({ error: 'email or password is incorrect' });
		}

		const validPass = await bcrypt.compare(password, user.password);
		if (!validPass) {
			return res
				.status(403)
				.json({ error: 'email or password is incorrect' });
		}

		// send login jwt as user is valid
		const token = jwt.sign({ user: user.username }, secret, {
			expiresIn: '1h',
		});

		return res.status(200).json({ user: user.username, token });
	} catch (error) {
		console.log(error);
	}
});

router.get('/private', async (req, res) => {
	const token = req.headers.authorization.split(' ')[1];
	const verify = jwt.verify(token, secret);
	if (verify) {
		// you can anything you want as he/she is real user
		res.status(200).json({ message: `${verify.user} is real user` });
	} else {
		res.status(401).json({ message: `anonymous go to hell 👹` });
	}
});

module.exports = router;
