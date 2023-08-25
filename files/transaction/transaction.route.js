const transactionRoute = require("express").Router()
const { checkSchema } = require("express-validator")
const { isAuthenticated, adminVerifier } = require("../../utils")

const {
  paymentIntentTransactionController,
  verifyTransactionController,
} = require("./controller/transaction.controller")

// transactionRoute.use(isAuthenticated)

transactionRoute.post("/payment-intent", paymentIntentTransactionController)
transactionRoute.patch("/verify", verifyTransactionController)

//routes
module.exports = transactionRoute
