require('dotenv').config();
const path =  require('path')

const express = require('express');
const app = express()

app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})