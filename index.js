/**
 * routes auth
 *
 * host + /api/auth
 */

const express = require('express');
const { dbConnection } = require('./db/config');
require('dotenv').config();
const cors = require('cors');

// app
const app = express();

//db
dbConnection();

//cors
app.use(cors());

// config
app.use(express.json());

// variables
const PORT = process.env.PORT;

// public folder
app.use(express.static('public'));

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// start server
app.listen(PORT, () => {
  console.log(`server listen on port ${PORT}`);
});
