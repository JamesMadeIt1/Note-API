require ('dotenv').config();

const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors');
const connectDB = require('./database/connectDB.js');
const mongoose = require('mongoose');
const Note = require('./models/note.model.js');
const noteRoutes = require('./routes/note.routes.js');

const app = express();

app.use(express.json());
app.use(cors('*'));
app.use('/api/notes', noteRoutes);

connectDB();


const PORT = process.env.PORT;
app.listen(PORT, ()=> {
    console.log (`Project is live on ${PORT}`);
});