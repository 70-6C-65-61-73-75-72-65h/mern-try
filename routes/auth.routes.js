const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const router = Router();

router.post(
  "/register",
  [
    check("email", "Invalid Email").isEmail(),
    check("password", "Min length of password is 6 symbols").isLength({
      min: 6,
    }), // or isStrongPassword
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid data while signup...",
        });
      }

      const { email, password } = req.body;
      const candidate = await User.findOne({ email });
      if (candidate) {
        res.status(400).json({ message: "Such user aready exists..." });
      }

      // hashing his password
      const hashedPass = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPass });

      await user.save();

      res.status(201).json({ message: "User successfully created..." });
      // res.end();
    } catch (error) {
      res.status(500).json({ message: "Smth went wrong, try another..." });
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Enter Valid Email").normalizeEmail().isEmail(),
    check("password", "Enter password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid data while signin...",
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        res.status(400).json({ message: "No such user found..." });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Pssword is incorrect" });
      }
      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "1h",
      });

      res.json({ token, userId: user.id }); // 200 by the default
      res.end();
    } catch (error) {
      res.status(500).json({ message: "Smth went wrong, try another..." });
    }
  }
);

module.exports = router;
