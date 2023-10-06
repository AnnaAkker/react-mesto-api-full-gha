require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const { errors } = require('celebrate');

const hemlet = require('helmet');
const cors = require('cors');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const handlerError = require('./middlewares/handlerErr');
const { limiter } = require('./middlewares/limiter');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(cors());

app.use(hemlet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use(limiter);

app.use('/', require('./routers/index'));

app.use(errorLogger);

app.use(errors());

app.use(handlerError);

app.listen(PORT);
