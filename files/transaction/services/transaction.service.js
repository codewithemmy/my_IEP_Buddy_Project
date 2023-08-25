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
      data: paymentDetails,
    }
  }

  static async initiateWithdrawalTransaction() {}

  static async verifyPaymentManually(payload) {
    await this.getConfig()
    return this.paymentProvider.verifyProviderPayment(payload.reference)
  }

  // static initiatePaymentIntentTransaction() {
  //   const order = await Order.findOne({ _id: req.body.orderId })

  //   if (!order) {
  //     return res.status(200).json({ msg: `invalid order Id` })
  //   }

  //   const transaction = await Transaction.create({
  //     ...req.body,
  //     customerId: req.user.userId,
  //   })

  //   if (req.body.transactionStatus === "Succeeded") {
  //     //update order with the transaction id
  //     order.transaction = transaction._id
  //     order.paymentStatus = "paid"

  //     await order.save()
  //     return res
  //       .status(200)
  //       .json({ msg: "transaction successfully created/updated" })
  //   } else {
  //     //update order with the transaction id
  //     order.transaction = transaction._id
  //     order.paymentStatus = "failed"

  //     await order.save()

  //     return res
  //       .status(200)
  //       .json({ msg: "transaction successfully created/updated" })
  //   }
  // }
}

module.exports = { TransactionService }
