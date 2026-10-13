require ('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler.js');
const logger = require('./middleware/logger.js');
const connectDB = require('./database/connectDB.js');
const UserModel = require('./models/user.model.js');
const noteRoutes = require('./routes/note.routes.js');
const dns = require('dns');

const app = express();
const PORT = process.env.PORT;

dns.setServers(["1.1.1.1", "8.8.8.8"]);

connectDB();

app.use(cors('*'));

app.use(express.json());
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use(RequestLogger);
app.use(rateLimit({ windowsMs: 15*60*1000, max: 100 }));

app.use('/api/notes', noteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pages', pageRoutes);


app.use(errorHandler);

app.listen(PORT, ()=> {
    console.log (`Project is live on ${PORT}`);
});