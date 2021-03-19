const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');


//Import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

//connect to DB
mongoose.connect(
  process.env.DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('Connected to DB')
);

//middlewares

app.use(express.json());

//Routes middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(5000, () => console.log('Server running on port 5000'));
