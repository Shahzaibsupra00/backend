const UserModel = require("../models/demouser.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Create new user
const Register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const user = new UserModel({ email, password: hashedPassword });
    await user.save();

    // Generate JWT token after saving
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set JWT token as a cookie
    res.cookie("jwtToken", jwtToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    // Send response and return immediately
    return res
      .status(201)
      .json({ message: "User created successfully", jwtToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Login user
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // Set JWT token as a cookie
    res.cookie("jwtToken", jwtToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax", // Adjust based on your frontend and backend domains
    });

    // Send response and return immediately
    return res.json({ message: "Login successful", jwtToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// logout user

const Logout = (req, res) => {
  try {
    // Clear the JWT token cookie
    res.clearCookie("jwtToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    return res.json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Add this above your module.exports
const VerifyAuth = async (req, res) => {
  try {
    // 1. Check if the cookie exists
    const token = req.cookies.jwtToken;
    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    // 2. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find the user (optional, but good practice to ensure they still exist)
    const user = await UserModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User no longer exists" });
    }

    // 4. Send back the user data
    return res.json({ user: { email: user.email } });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Update your export!
module.exports = { Register, Login, Logout, VerifyAuth };
