const Employee = require('../models/Employee');

// create employee
const createEmployee = async (req, res) => {
  try {
    const { name, role, branchId } = req.body;

    if (!name || !role || !branchId) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const employee = await Employee.create({ name, role, branchId });

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get employees by branch
const getEmployeesByBranch = async (req, res) => {
  try {
    const employees = await Employee.find({ branchId: req.params.branchId });

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createEmployee, getEmployeesByBranch };