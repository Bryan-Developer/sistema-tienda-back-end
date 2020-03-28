require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('./rests-controllers/index'));
mongoose.set('useCreateIndex', true);
mongoose.connect(
  process.env.URLDB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error, respuesta) => {
    if (error) throw error;
  }
);
app.listen(process.env.PORT, () => {});
