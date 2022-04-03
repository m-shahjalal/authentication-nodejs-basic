app.post('/create-jwt', async (req, res) => {
	try {
		const token = jwt.sign({ user: 'imran' }, process.env.SECRET, {
			expiresIn: '1h',
		});
		res.json({ token: token, message: 'jwt creation successful!' });
	} catch (error) {
		console.log(error);
	}
});

app.post('/check-jwt', async (req, res) => {
	const token = req.body.token;
	try {
		const payload = jwt.verify(token, process.env.SECRET);
		console.log(payload);
		if (payload) {
			res.json({ message: `${payload.user} is valid user!` });
		} else {
			res.json({ message: `${payload.user}, who are you man!!!` });
		}
	} catch (error) {
		return res.json({ error: error.message });
	}
});
