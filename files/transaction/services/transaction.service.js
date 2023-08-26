const { default: mongoose } = require("mongoose")
const { StripePaymentService } = require("../../../providers/stripe/stripe")
const {
  TransactionFailure,
  TransactionSuccess,
  TransactionMessages,
} = require("../transaction.messages")
const { UserRepository } = require("../../user/user.repository")

const { TransactionRepository } = require("../transaction.repository")
const { queryConstructor } = require("../../../utils")

class TransactionService {
  static paymentProvider

  static async getConfig() {
    this.paymentProvider = new StripePaymentService()
  }

  static async initiatePaymentIntentTransaction(payload) {
    const { amount, userId, channel } = payload

    const user = await UserRepository.findSingleUserWithParams({
      _id: new mongoose.Types.ObjectId(userId),
    })

    if (!user) return { success: false, msg: `user not found` }

    await this.getConfig()
    const paymentDetails = await this.paymentProvider.createPaymentIntent({
      amount,
    })

    if (!paymentDetails)
      return { success: false, msg: `unable to make or create payment intent` }

    const { clientSecret, transactionId } = paymentDetails

    await TransactionRepository.create({
      name: user.fullName,
      email: user.email,
      amount,
      userId,
      channel,
      clientSecret,
      transactionId,
    })

    return {
      success: true,
      msg: TransactionSuccess.INITIATE,
      data: paymentDetails,
    }
  }

  static async verifyStripePaymentService(payload) {
    const { transactionId, status } = payload

    const transaction = await TransactionRepository.fetchOne({
      transactionId: transactionId,
    })

    if (!transaction) return { success: false, msg: `transaction not found` }

    if (status === "succeeded") {
      transaction.status = "active"
      await transaction.save()

      return {
        success: true,
        msg: `transaction status update successful`,
      }
    }

    if (status === "failed") {
      transaction.status = "failed"
      await transaction.save()

      return {
        success: true,
        msg: `transaction status update successful`,
      }
    }
  }

  static async getTransactionService(payload, locals) {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "Transaction"
    )
    if (error) return { success: false, msg: error }

    let teacher = { userId: new mongoose.Types.ObjectId(locals._id) }

    const transaction = await TransactionRepository.fetchTransactionsByParams({
      ...params,
      limit,
      skip,
      sort,
      ...teacher,
    })

    if (transaction.length < 1)
      return { success: false, msg: `you don't have any transaction history` }

    return {
      success: true,
      msg: `transaction fetched successfully  `,
      data: transaction,
    }
  }
}

module.exports = { TransactionService }
