const Users = require("./auth-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = require("express").Router();

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findBy({ username }).first();

    if (user) {
      return res.status(409).json({
        message: "Username is already taken",
      });
    }

    const newUser = await Users.add({
      username,
      password: await bcrypt.hash(password, 14),
    });

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findBy({ username }).first();

    if (!user) {
      return res.status(401).json({
        message: "You shall not pass!",
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({
        message: "You shall not pass!",
      });
    }

    const tokenPayload = {
      userId: user.id,
      username: user.username,
      userRole: "normal",
    };

    res.json({
      message: `Welcome ${user.username}!`,
      token: jwt.sign(tokenPayload, process.env.JWT_SECRET),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
