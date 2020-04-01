require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('./rests-controllers/index'));
app.use(express.static(path.resolve(__dirname, '../public')));
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(
  process.env.URLDB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error, respuesta) => {
    if (error) throw error;
  }
);
app.listen(process.env.PORT, () => {});
