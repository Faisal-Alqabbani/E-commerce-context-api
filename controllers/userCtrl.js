const Users = require("../models/userModel");
const Payment = require("../models/paymentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: "The email already exists." });
      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password is at least 6 characters!" });
      // password encryption
      const passwordHash = await bcrypt.hash(password, 10);
      // create new user
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
      });
      // Save mongodb
      await newUser.save();
      // then create jsonwebtoken to authentication
      const accessToken = createAccessToken({ id: newUser._id });
      const refreshToken = createRefreshToken({ id: newUser._id });
      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
      });
      res.status(201).json({ token: accessToken });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      // first check!
      if (!email || !password)
        return res
          .status(400)
          .json({ msg: "You must provide an email and password" });
      // query to the user inside a database
      const user = await Users.findOne({ email });
      // second check if the user dose not exist
      if (!user) return res.status(400).json({ msg: "User does not exists" });
      // compare between to passwords
      const isMatch = await bcrypt.compare(password, user.password);
      // third check if the password dose not match!
      if (!isMatch) return res.status(400).json({ msg: "Incorrect password." });
      // if login success, createAccsessToken and refreshToken
      const accessToken = createAccessToken({ id: user._id });
      const refreshToken = createRefreshToken({ id: user._id });
      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
      });
      res.status(201).json({ token: accessToken });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.status(200).json({ msg: "Logged out!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ msg: "Please Login or Register!" });
      jwt.verify(rf_token, process.env.REFRESH_TOEKEN_SECRET, (error, user) => {
        if (error)
          return res.status(400).json({ msg: "please Login or Register!" });
        const accesstoken = createAccessToken({ id: user.id });
        return res.json({ accesstoken });
      });

      // res.json({ rf_token });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password -__v");
      if (!user) return res.status(400).json({ msg: "User dose not exist!" });
      res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  addCart: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.state(400).json({ msg: "User dose not exists!" });
      const some = await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          $set: {
            cart: req.body.cart,
          },
        }
      );
      return res.status(200).json({ msg: "Added to Cart!", cart: user });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  history: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.status(404).json({ msg: "User dose not exists!" });
      const history = await Payment.find({ user_id: req.user.id });
      res.status(200).json(history);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "11m" });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOEKEN_SECRET, { expiresIn: "1d" });
};
module.exports = userCtrl;
