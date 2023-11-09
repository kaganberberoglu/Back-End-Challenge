const express = require('express');
const cors = require("cors");
const helmet = require("helmet");

const usersmw = require("./users/users-middleware");
const postsmw = require("./posts/posts-middleware");

const userRouter = require("./users/users-router");
const postRouter = require("./posts/posts-router");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use(usersmw.logger);
server.use(postsmw.logger);

server.get('/', (req, res) => {
    res.send("In this back-end project, a sample rest-api study like social media apps was done. I hope you have a smooth experience using endpoints with the help of the Github link (https://github.com/kaganberberoglu/Back-End-Project-1/tree/main). Thank you:)");
});

server.use("/api/users", userRouter);
server.use("/api/posts", postRouter);

module.exports = server;
