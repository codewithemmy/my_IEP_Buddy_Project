const { Transaction } = require("./transaction.model")

class TransactionRepository {
  static async create(transactionPayload) {
    return Transaction.create({ ...transactionPayload })
  }

  static async fetchOne(payload, populate = false) {
    if (populate) return Transaction.findOne({ ...payload }).populate("loanId")
    return Transaction.findOne({ ...payload })
  }

  static async fetchTransactionsByParams(userPayload) {
    const { limit, skip, sort, ...restOfPayload } = userPayload
    const transaction = await Transaction.find({
      ...restOfPayload,
    })
      .populate("userId", { _id: 1, fullName: 1, image: 1 })
      .sort(sort)
      .skip(skip)
      .limit(limit)
    return transaction
  }

  static async fetch(payload, select) {
    return Transaction.find({ ...payload }).select(select)
  }

  static async updateTransactionDetails(transactionPayload, update) {
    const { lastErrorObject: response } = await Transaction.findOneAndUpdate(
      {
        ...transactionPayload,
      },
      { ...update },
      { rawResult: true } //returns details about the update
    )

    return response
  }

  static async fetchLendersTransactionHistory(payload) {
    const transactionDetails = await Transaction.aggregate([...payload])
    return transactionDetails
  }
}

module.exports = { TransactionRepository }
