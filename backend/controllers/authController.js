const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  profileImage: user.profileImage,
});

const createToken = (user) =>
  jwt.sign(publicUser(user), process.env.JWT_SECRET, { expiresIn: "7d" });

exports.register = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ message: "Please choose a valid account type" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      token: createToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to register user" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (role && !["admin", "user"].includes(role)) {
      return res.status(400).json({ message: "Please choose a valid login type" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (role && user.role !== role) {
      return res.status(403).json({
        message: `This account is registered as ${user.role}. Please choose the correct login type.`,
      });
    }

    return res.json({
      token: createToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to sign in" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ where: { email } });
    if (user) {
      console.log(`Password reset requested for ${user.email}`);
    }

    return res.json({
      message: "If this email exists, a password reset request has been sent to the administrator.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to process password reset request" });
  }
};

exports.me = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ user: publicUser(user) });
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, profileImage } = req.body;
    if (name !== undefined) {
      user.name = name;
    }
    if (profileImage !== undefined) {
      user.profileImage = profileImage || null;
    }

    await user.save();
    return res.json({ user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ message: "Unable to update profile" });
  }
};
