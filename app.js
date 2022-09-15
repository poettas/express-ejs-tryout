const { json } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser"); // a tool to simplify working with cookies --> middleware
const authRoutes = require("./routes/authRoutes");
const { log } = require("npmlog");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

const app = express();

// middleware
app.use(express.static("public"));
//that takes away any json data that comes along wist a request and
//parses it into a js object for us, so that it is usable for us inside the code
// it attaches that object with that data for the request so that it is acessable for us in the request handeler
app.use(express.json());
app.use(cookieParser());

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
    .then((result) => {
        app.listen(3005);
        console.log("connected to DB");
    })
    .catch((err) => console.log(err));

// routes

app.get("*", checkUser); //using "*" applies that one to all routes
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.use(authRoutes);

// cookies
