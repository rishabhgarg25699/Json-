const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const apiCntrl = require("./api/apiController");

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/*", apiCntrl.read);
app.post("/*", apiCntrl.post);
app.delete("/*", apiCntrl.del);
module.exports = app;
