const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const Post = require('./models/post');

const postRoutes = require('./routes/posts');

mongoose.connect("mongodb+srv://admin:admin@cluster0.7eufd.mongodb.net/node-angular?retryWrites=true&w=majority")
    .then(() => {
        console.log("DATABASE CONNECTED");
    })
    .catch(() => {
        console.log("DATABASE CONNECTION FAILED");
    });

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended:false }));

app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

app.use("/posts",postRoutes);



module.exports = app;