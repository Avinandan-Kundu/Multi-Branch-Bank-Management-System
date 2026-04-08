const mongoose = require('mongoose');
const calculateCash = require('../utils/cashCalculator');

const branchSchema = new mongoose.Schema(
  {
    branchName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    cashReserve: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    cashLimit: {
      type: Number,
      required: true,
      default: function () {
        const normalizedStaffCount = Math.max(0, Number(this.staffCount ?? 0) || 0);
        return calculateCash(normalizedStaffCount, 0);
      },
      min: 0,
    },
    staffCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Branch', branchSchema);