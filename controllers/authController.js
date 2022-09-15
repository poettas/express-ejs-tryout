const User = require("../models/User");

//get the jwt
const jwt = require("jsonwebtoken");

//
//create a function for the errorhandling to not destroy the order off the code
const handleErrors = (err) => {
    console.log(err.message, err.code);
    //because error = object
    let errors = { email: "", password: "", name: "" };

    //incorrect email
    if (err.message === "incorrect email") {
        errors.email = "wrong or unregistered email";
    }

    //incorrect password
    if (err.message === "incorrect password") {
        errors.password = "password does not fit the mail";
    }

    //dublicate error code
    if (err.code === 11000) {
        errors.email = "that email is already in use";
        return errors;
    }

    //validation errors
    if (err.message.includes("user validation failed")) {
        //({}) -> destructing an object
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
};

//
//create webtoken
const maxAge = 3 * 24 * 60 * 60; // value of 3 days in seconds
const createToken = (id) => {
    // header automatically, id for payload, secret for generating the signature, 3. is options for expireing the token
    return jwt.sign({ id }, "pstyles secret", {
        expiresIn: maxAge,
    });
};

//
//according to the mvc

const signup_get = (req, res) => {
    res.render("signup");
};

const login_get = (req, res) => {
    res.render("login");
};

const signup_post = async (req, res) => {
    const { email, password, userName } = req.body;

    //create new user and send data to DB
    try {
        const user = await User.create({ email, password, userName });
        //create token
        const token = createToken(user._id);
        //create cookie and sign data to interface
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

const login_post = async (req, res) => {
    //this shows the posted data by the thunder client, by using destructering
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        //create jwt and sign data to interface
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

const logout_get = (req, res) => {
    //the jwt itselt can't delete directly from the server, but we can turn it into a another blank cookie with a short expiration date
    res.cookie("jwt", "", { maxAge: 1 }); // --> that changes the token value from the jwt to another
    res.redirect("/");
};

module.exports = {
    signup_get,
    login_get,
    signup_post,
    login_post,
    logout_get,
};
