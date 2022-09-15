const express = require("express");
const mongoose = require("mongoose");

const app = express();

// middleware
app.use(express.static("public"));

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI =
    "mongodb+srv://testUser:test0123@node-auth.qd8oc.mongodb.net/node-auth?retryWrites=true&w=majority";
mongoose
    /* useNewUrlParser, useUnifiedTopology, useFindAndModify, and useCreateIndex are no longer 
    supported options. Mongoose 6 always behaves as if useNewUrlParser, useUnifiedTopology, and 
    useCreateIndex are true, and useFindAndModify is false. Please remove these options from your code. */
    .connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// routes
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", (req, res) => res.render("smoothies"));
