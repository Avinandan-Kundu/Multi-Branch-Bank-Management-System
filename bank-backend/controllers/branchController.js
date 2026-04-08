const Branch = require('../models/Branch');
const Transaction = require('../models/Transaction');
const Employee = require('../models/Employee');
const calculateCash = require('../utils/cashCalculator');
// @desc    Create a new branch
// @route   POST /api/branches
// @access  Public 

const createBranch = async (req, res) => {
  try {
    const { branchName, location, cashReserve, staffCount } = req.body;

    if (!branchName || !location) {
      return res.status(400).json({ message: 'branchName and location are required' });
    }

    const normalizedStaffCount = Math.max(0, Number(staffCount ?? 0) || 0);
    const calculatedCashLimit = calculateCash(normalizedStaffCount, 0);

    const branch = new Branch({
      branchName,
      location,
      cashReserve: cashReserve ?? 0,
      cashLimit: calculatedCashLimit,
      staffCount: normalizedStaffCount,
    });

    await branch.save();

    res.status(201).json(branch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all branches
// @route   GET /api/branches
// @access  Public
const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find();
    res.json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getCashRequirement = async (req, res) => {
  try {
    const branchId = req.params.id;

    // count employees
    const employeeCount = await Employee.countDocuments({ branchId });

    const transactions = await Transaction.countDocuments({ branchId });

    const cashRequired = calculateCash(employeeCount, transactions);

    res.json({
      branchId,
      employeeCount,
      transactions,
      cashRequired
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetBranchCash = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await Branch.findById(id);

    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    const toppedUpBy = Math.max(0, (branch.cashLimit || 0) - (branch.cashReserve || 0));

    if (toppedUpBy > 0) {
      branch.cashReserve += toppedUpBy;
      await branch.save();
    }

    res.json({ branch, toppedUpBy });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
    createBranch,
    getBranches,
    getCashRequirement,
    resetBranchCash,
  };