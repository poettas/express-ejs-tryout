const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    //check jwt exists & is verified
    if (token) {
        //the method on the jwt verify the token itself, 1. the grabbed token, 2. the secret we used for the creation and -->
        // 3. a func that fires based on the outcome of the recreation
        // process: retrogradiation, the verfication recreats the token based on the secret and the userid as the payload
        jwt.verify(token, "pstyles secret", (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect("/login");
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect("/login");
    }
};

//check current userid
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    //check if the token exists an d if its valid
    if (token) {
        jwt.verify(token, "pstyles secret", async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

module.exports = { requireAuth, checkUser };
