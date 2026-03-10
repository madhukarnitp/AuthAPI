const express = require("express");
const router = express.Router();
const User = require("../models/user.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const {
  signupValidator,
  loginValidator,
} = require("../validators/authValidator");
const { generateAccessToken, refreshAccessToken } = require("../utils/tokenGenerator");
const strictBody = require("../middleware/strictBody");
const sendEmail = require("../utils/sendEmail");
const validate = require("../middleware/validate");
const { body } = require("express-validator");
const protect = require('../middleware/protect')
router.post(
  "/signup",
  strictBody(["fullname", "email", "password", "phone"]),
  signupValidator,
  validate,
  async (req, res) => {
    try {
      const { fullname, email, password, phone } = req.body;
      const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
      if (existingUser)
        return res.status(409).json({ message: "User already Exists!" });

      const expirationTime = Date.now() + 2 * 60 * 60000;
      const hasedPassword = await bcrypt.hash(password, 10);
      const verifyToken = crypto.randomBytes(32).toString("hex");

      const user = new User({
        fullname,
        email,
        phone,
        password: hasedPassword,
        emailVerificationToken: verifyToken,
        emailVerificationExpires: expirationTime,
      });
      const saveUser = await user.save();

      const verifyURL = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;
      await sendEmail(email, "Verify Your MyAPP Account", verifyURL, "verificationLink",user.fullname);
      res.status(201).json({
        success: true,
        message: "SingnUp Successfully. Please Verify Email.",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

router.post(
  "/login",
  strictBody(["email", "password"]),
  loginValidator,
  validate,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(401).json({
          success: false,
          message: "Username doesn't Exists!",
        });

      if (!user.isVerified)
        return res.status(403).json({
          success: false,
          message: "Account Not Verified! <br> please Verify Account first!",
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({
          success: false,
          message: "Username or Password Incorrect!",
        });

      const accessToken = generateAccessToken(user._id);
      const refreshToken = refreshAccessToken(user._id);

      user.refreshToken = refreshToken;
      await user.save();

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      const userData = {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        phone: user.phone,
      }

      res.json({
        success: true,
        message: "Login successful",
        user: userData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server Error!",
      });
    }
  },
);

router.post("/logout", async (req, res) => {
  try {
    const decoded = jwt.verify(
      req.cookies.refreshToken,
      process.env.JWT_REFRESH_SECRET,
    );
    const user = await User.findById(decoded.id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "Logged out Successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/verify-email/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      emailVerificationToken: req.params.token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({
        success: false,
        message: "Invalid or Expired Verification Token!",
      });

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();
    
    res.redirect("http://localhost:3000/email-verified.html");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User Not Found!" });
    if (user.isVerified)
      return res.json({ message: "Email Already Verified!" });

    const verifyToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = verifyToken;
    user.emailVerificationExpires = Date.now() + 2 * 60 * 60000;
    await user.save();

    const verifyURL = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;
    await sendEmail(email, "Verify Your MyAPP Account", verifyURL, "verificationLink",user.fullname);
    res.status(201).json({
      success: true,
      message: "Verification Email resent!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/access-token", protect, async (req, res) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No access token!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Verified User!",
      user: user,
    });
  } catch (err) {
    return res.status(401).json({ success: false });
  }
});

router.post("/refresh-token", async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No refresh token!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
      });
    }
    const accessToken = generateAccessToken(user._id);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      message: "Token refreshed",
    });
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Refresh token expired",
    });
  }
});

router.post("/forgot-password-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({
        success: false,
        message: "User Not Found!",
      });

    const otp = crypto.randomInt(100000, 1000000);
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    await sendEmail(email, "Reset Your Password", otp, "OTP", user.fullname);
    res.status(200).json({
      success: true,
      message: "Password reset OTP sent to email",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post(
  "/reset-password-otp",
  strictBody(["email", "otp", "password"]),
  async (req, res) => {
    try {
      const { email, otp, password } = req.body;

      const user = await User.findOne({
        email,
        resetOtp: otp,
        resetOtpExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired OTP",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user.password = hashedPassword;
      user.resetOtp = undefined;
      user.resetOtpExpires = undefined;

      await user.save();

      res.json({
        success: true,
        message: "Password reset successfully",
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
