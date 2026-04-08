const express = require('express');
const router = express.Router();

const {
  createBranch,
  getBranches,
  getCashRequirement,
  resetBranchCash,
} = require('../controllers/branchController');

router.route('/').get(getBranches).post(createBranch);
router.get('/:id/cash', getCashRequirement);
router.patch('/:id/reset', resetBranchCash);

module.exports = router;