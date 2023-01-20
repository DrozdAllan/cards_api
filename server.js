require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {errorHandler} = require("./middleware/errorMiddleware");
const connectDB = require('./config/database');
const port = process.env.port || 3000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

// Top level Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/cards', require('./routes/cardRoutes'));

// Global error handling
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
