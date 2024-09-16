require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const indexRouter = require('./routes/indexRoute');
const babyGearsRouter = require('./routes/babyGearsRouter');
const boysClothRouter = require('./routes/boysClothRouter');
const diapersRouter = require('./routes/diapersRouter');
const feedingsRouter = require('./routes/feedingsRouter');
const girlsClothRouter = require('./routes/girlsClothRouter');
const toysRouter = require('./routes/toysRouter');

const app = express();  

const corsOptions = {
    origin: 'http://localhost:5173', 
    methods: 'GET,POST,PUT,DELETE',  
    credentials: true,              
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/baby_gear', babyGearsRouter);
app.use('/boys_clothes', boysClothRouter);
app.use('/diapers', diapersRouter);
app.use('/feedings', feedingsRouter);
app.use('/girls_clothes', girlsClothRouter);
app.use('/toys', toysRouter);

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
