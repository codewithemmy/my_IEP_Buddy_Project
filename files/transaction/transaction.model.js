const mongoose = require("mongoose")

const TransactionSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      refPath: "userType",
    },
    amount: {
      type: Number,
      required: true,
    },
    channel: {
      type: String,
      required: true,
      enum: ["stripe", "other"],
    },
    reference: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "pending",
    },
    paymentFor: {
      type: String,
      enum: [
        "loanSubmission",
        "loanRepayment",
        "cardInitilization",
        "enterpriseSubscription",
        "loanCrediting",
      ],
    },
    metaData: String,
  },
  { timestamps: true }
)

const transaction = mongoose.model(
  "Transaction",
  TransactionSchema,
  "transaction"
)

module.exports = { Transaction: transaction }
