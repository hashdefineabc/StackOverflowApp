const express = require("express");
const mongoose = require("mongoose");
const process = require("process");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

//const {MONGO_URL, PORT} = process.env;

const MONGO_URL = "mongodb://127.0.0.1:27017/fake_so";
const CLIENT_URL = "http://localhost:3000";
const port = 8000;

mongoose.connect(MONGO_URL)  
.then(() => console.log("MongoDB is  connected successfully"))
.catch((err) => console.error(err));

const app = express();
app.use(express.json());

app.use(
    cors({
        credentials: true,
        origin: [CLIENT_URL],
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.use(cookieParser());



app.get("", (req, res) => {
    res.send("hello world");
    res.end();
});

const questionController = require("./controller/question");
const tagController = require("./controller/tag");
const answerController = require("./controller/answer");
const authController = require("./controller/authController");

app.use("/question", questionController);
app.use("/tag", tagController);
app.use("/answer", answerController);
app.use("/auth", authController);

let server = app.listen(port, () => {
    console.log(`Server starts at http://localhost:${port}`);
});

process.on("SIGINT", () => {
    server.close();
    mongoose.disconnect();
    console.log("Server closed. Database instance disconnected");
    process.exit(0);
});

module.exports = server
