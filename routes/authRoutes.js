//get the router out of express
const { Router } = require("express");

//import the authControllers
const authController = require("../controllers/authController");
// const {isLoggedIn, adminOnly} =retuire("")

// function for evoking the router
const router = Router();
// --> to attach diffrent request to the router

router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);
router.get("/login", authController.login_get);
router.post("/login", authController.login_post);
router.get("/logout", authController.logout_get);
// router.get("/signup", isLoggedIn, adminOnly, authController.getAllUserInfo);

module.exports = router;
