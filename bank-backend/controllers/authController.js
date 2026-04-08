const mongoose = require('mongoose');
const User = require('../models/User');
const Branch = require('../models/Branch');

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  pass: user.pass,
  balance: user.balance,
  branchId: user.branchId,
  role: user.role,
  employeeId: user.employeeId,
  accessLevel: user.accessLevel,
});

const resolveBranchId = async (branchId) => {
  if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
    const branch = await Branch.findById(branchId);
    if (branch) {
      return branch._id;
    }
  }

  const firstBranch = await Branch.findOne().sort({ createdAt: 1 });
  return firstBranch?._id;
};

const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      pass,
      balance = 0,
      branchId,
      role = 'customer',
      employeeId = '',
      accessLevel = '',
    } = req.body;

    if (!name || !email || !pass) {
      return res.status(400).json({ message: 'name, email, and pass are required' });
    }

    const existingUser = await User.findOne({ email: String(email).toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const resolvedBranchId = await resolveBranchId(branchId);

    const user = await User.create({
      name,
      email,
      pass,
      balance,
      branchId: resolvedBranchId,
      role,
      employeeId,
      accessLevel,
    });

    res.status(201).json(sanitizeUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, pass } = req.body;

    if (!email || !pass) {
      return res.status(400).json({ message: 'email and pass are required' });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() });

    if (!user || user.pass !== pass) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json(sanitizeUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, pass } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email) {
      const normalizedEmail = String(email).toLowerCase().trim();
      const existingUser = await User.findOne({ email: normalizedEmail, _id: { $ne: id } });

      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      user.email = normalizedEmail;
    }

    if (pass) {
      user.pass = pass;
    }

    await user.save();

    res.json(sanitizeUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signup,
  login,
  updateProfile,
};
