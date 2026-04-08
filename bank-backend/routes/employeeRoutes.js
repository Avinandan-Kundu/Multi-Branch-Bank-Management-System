const express = require('express');
const router = express.Router();

const {
  createEmployee,
  getEmployeesByBranch
} = require('../controllers/employeeController');

router.post('/', createEmployee);
router.get('/branch/:branchId', getEmployeesByBranch);

module.exports = router;