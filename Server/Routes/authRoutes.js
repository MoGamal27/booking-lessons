const { signup, signIn } = require("../Controller/authController");
const { signupValidator, signinValidator } = require("../utils/validators/authValidator");
const express = require("express");

const router = express.Router();

router.post("/signup", signupValidator ,signup);
router.post("/signin", signinValidator ,signIn);

module.exports = router;