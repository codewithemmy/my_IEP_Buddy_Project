const transactionRoute = require("express").Router()
const { checkSchema } = require("express-validator")
// const { isAuthenticated, adminVerifier } = require("../../utils")

// const {
//   initiateLoanPaymentValidation,
// } = require("../../validations/transaction/createtransaction.validation")
// const { validate } = require("../../validations/validate")

const {
  paymentIntentTransactionController,
} = require("./controller/transaction.controller")

// transactionRoute.post("/paystack-webhook", paystackWebHook)

transactionRoute.post("/payment-intent", paymentIntentTransactionController)

// transactionRoute.put("/verify", verifyTransactionController)
//routes
module.exports = transactionRoute
