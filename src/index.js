const express = require('express');
const cors = require('cors');

// Middlewares
const app = express();
app.use(express.json());
app.use(cors());

// Basic SQL injection security
app.use((req, res, next) => {
	const regex = /^((?!('"\$\\—)).)*$/;
	if (regex.test(Object.values(req.body).join())) {
	  next();
	} else {
		res.status(400).json({ error: 'Bad Request.' });
	}
});

app.use((req, res) => {
	res.status(404);
	res.json({ error: 'Not found' });
})

app.listen(3000);
console.log('Server on port 3000');
