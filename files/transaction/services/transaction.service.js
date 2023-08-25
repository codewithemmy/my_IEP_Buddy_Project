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
    const { amount } = payload

    await this.getConfig()
    const paymentDetails = await this.paymentProvider.createPaymentIntent({
      amount,
    })

    if (!paymentDetails)
      return { success: false, msg: `unable to make or create payment intent` }

    return {
      success: true,
      msg: TransactionSuccess.INITIATE,
      data: {
        ...paymentDetails,
      },
    }
  }

  static async initiateWithdrawalTransaction() {}

  static async verifyPaymentManually(payload) {
    await this.getConfig()
    return this.paymentProvider.verifyProviderPayment(payload.reference)
  }
}

module.exports = { TransactionService }
