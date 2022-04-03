require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = require('./router');

const app = express();
app.use(express.json());

const { dbname, password } = process.env;

const URL = `mongodb+srv://${dbname}:${password}@cluster0.1gsip.mongodb.net/jtw-imran?retryWrites=true&w=majority`;

app.get('/', (_req, res) => res.json({ message: 'hello jwt!' }));
app.use(router);

mongoose
	.connect(URL)
	.then(() => {
		app.listen(5000, () =>
			console.log('listening on http://localhost:5000')
		);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
