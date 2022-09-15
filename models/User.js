const mongoose = require("mongoose");

//import validator for the validation of the mail
const { isEmail } = require("validator");

//import bcrypt for the corecct saving of the passwords
const bcrypt = require("bcrypt");

//create a new Schema

// to add specific errors for the user, we have to define them in the schema -> required

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        // the unique is important, becuase with this,
        //the user can only create one profil with his email, express is
        //checking if there isalready someone with this email in the DB
        lowercase: true,
        validate: [isEmail, "Please enter a valid email address"],
        //to make sure, that there is a valid email address, there are two options, the first is a check with dummy.data, the second is a check
        //with a third party validation software, here we will check the second
    },
    //for the hashing of the password, we will use again a third party package and mongoose hooks
    //mongoose hooks normally fire afte a certain event has been activated
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, "Your password must be at least 6 characters"], //no CamelCase right here
    },
    userName: {
        type: String,
        //required: [true, "Please enter your name"],
    },
    /*   role: {
        type: String,
        valid: ["admin", "user"],
    }, */
});

//hooks
//examples
// fire a function after doc saved to the database , post !== post events
// ----> this is like creating custom middleware, because, without next, the site will just hanging
userSchema.post("save", function (doc, next) {
    console.log("new user was created & saved");
    next(); //always use next after custom middleware and hooks
});

//fire a function before doc saved to db
userSchema.pre("save", function (next) {
    console.log("user is about to be created and saved", this);
    next();
});

//bcrypt ---> async
userSchema.pre("save", async function (next) {
    //creating the salt
    const salt = await bcrypt.genSalt();

    //add the salt to the password
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//mongoose itself has has no ability to login users directly, we have to create an own static method in the model
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });

    if (user) {
        //direct comparison of the two passwords
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("incorrect password");
    }
    throw Error("incorrect email");
};
//connect Schema to the model
// first argument of the model have to be the singular of the DB collection
const User = mongoose.model("user", userSchema);

module.exports = User;
