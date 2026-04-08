const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getTransactionsByBranch,
  depositToAccount,
  withdrawFromAccount,
  getAllTransactions,
  getTransactionsByUser,
} = require('../controllers/transactionController');

router.post('/', createTransaction);
router.post('/deposit', depositToAccount);
router.post('/withdrawal', withdrawFromAccount);
router.get('/', getAllTransactions);
router.get('/branch/:branchId', getTransactionsByBranch);
router.get('/user/:userId', getTransactionsByUser);

module.exports = router;