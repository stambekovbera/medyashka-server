require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./routes');
const path = require("path");

//Middlewares
const {errorHandlerMiddleware} = require('./middlewares');

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static/avatars")));
app.use(fileUpload({}));
app.use('/medya-api', router);

//ERROR MIDDLEWARE
app.use(errorHandlerMiddleware);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => {
            console.log(PORT);
        })
    } catch (err) {
        console.log(err);
    }
}

start();