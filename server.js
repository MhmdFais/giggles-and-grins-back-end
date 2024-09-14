require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const indexRouter = require('./routes/indexRoute');
const babyGearsRouter = require('./routes/babyGear');
const boysClothRouter = require('./routes/boysCloth');
const diapersRouter = require('./routes/diapers');
const feedingsRouter = require('./routes/feedings');
const girlsClothRouter = require('./routes/girlsCloth');
const toysRouter = require('./routes/toys');

const app = express();  // Declare and initialize app before using it

const corsOptions = {
    origin: 'http://localhost:5173', 
    methods: 'GET,POST,PUT,DELETE',  
    credentials: true,              
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/babygear', babyGearsRouter);
app.use('/boys', boysClothRouter);
app.use('/diapers', diapersRouter);
app.use('/feeding', feedingsRouter);
app.use('/girls', girlsClothRouter);
app.use('/toys', toysRouter);

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
