const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Branch = require('../models/Branch');
const { getChannel } = require('../config/rabbitmq');

const createTransaction = async (req, res) => {
  try {
    const { branchId, customerName, amount, transactionType } = req.body;

    if (!branchId || !amount || !transactionType) {
      return res.status(400).json({
        message: 'branchId, amount, and transactionType are required',
      });
    }

    const transaction = await Transaction.create({
      branchId,
      customerName,
      amount,
      transactionType,
    });

    const channel = getChannel();

    if (channel) {
      const queue = 'transactions';

      await channel.assertQueue(queue, { durable: false });

      channel.sendToQueue(
        queue,
        Buffer.from(
          JSON.stringify({
            event: 'transaction_created',
            data: transaction,
          })
        )
      );

      console.log('Transaction event sent to RabbitMQ');
    }

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTransactionsByBranch = async (req, res) => {
  try {
    const transactions = await Transaction.find({ branchId: req.params.branchId });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const emitTransactionEvent = async (transaction) => {
  const channel = getChannel();

  if (!channel) {
    return;
  }

  const queue = 'transactions';
  await channel.assertQueue(queue, { durable: false });
  channel.sendToQueue(
    queue,
    Buffer.from(
      JSON.stringify({
        event: 'transaction_created',
        data: transaction,
      })
    )
  );
};

const processCustomerTransaction = async (req, res, transactionType) => {
  try {
    const { customerId, amount, branchId } = req.body;

    if (!customerId || !amount || !branchId) {
      return res.status(400).json({ message: 'customerId, amount, and branchId are required' });
    }

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    const user = await User.findById(customerId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    if (transactionType === 'withdrawal') {
      if (user.balance < parsedAmount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }

      if (branch.cashReserve < parsedAmount) {
        return res.status(400).json({ message: 'Selected branch does not have enough cash for this withdrawal.' });
      }

      user.balance -= parsedAmount;
    } else {
      user.balance += parsedAmount;
    }

    await user.save();

    const projectedBranchBalance =
      transactionType === 'withdrawal'
        ? branch.cashReserve - parsedAmount
        : branch.cashReserve + parsedAmount;

    const transaction = await Transaction.create({
      customerId: user._id,
      branchId: branch._id,
      customerName: user.name,
      amount: parsedAmount,
      transactionType,
    });

    await emitTransactionEvent(transaction);

    res.status(201).json({
      customer: {
        _id: user._id,
        balance: user.balance,
      },
      branch: {
        _id: branch._id,
        balance: projectedBranchBalance,
      },
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const depositToAccount = async (req, res) => processCustomerTransaction(req, res, 'deposit');

const withdrawFromAccount = async (req, res) => processCustomerTransaction(req, res, 'withdrawal');

const getAllTransactions = async (_req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 }).populate('branchId', 'location');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTransactionsByUser = async (req, res) => {
  try {
    const transactions = await Transaction.find({ customerId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('branchId', 'location');

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTransaction,
  getTransactionsByBranch,
  depositToAccount,
  withdrawFromAccount,
  getAllTransactions,
  getTransactionsByUser,
};