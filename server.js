const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs')
const app = express();

app.use(express.json())


app.listen(5000, () => console.log('Server started on port 5000'));