const { BAD_REQUEST, SUCCESS } = require("../../../constants/statusCode")
const { responseHandler } = require("../../../core/response")
const { manageAsyncOps } = require("../../../utils")
const { CustomError } = require("../../../utils/errors")
const { TransactionService } = require("../services/transaction.service")
// const crypto = require("crypto")

const paymentIntentTransactionController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    TransactionService.initiatePaymentIntentTransaction(req.body)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

// const paystackWebHook = async (req, res, next) => {
//   const hash = crypto
//     .createHmac("sha512", config.PAYSTACK_KEY)
//     .update(JSON.stringify(req.body))
//     .digest("hex")

//   if (hash == req.headers["x-paystack-signature"]) {
//     // Retrieve the request's body
//     const event = req.body
//     const [error, data] = await manageAsyncOps(
//       TransactionService.verifyCardPayment(event)
//     )
//     res.send(200)
//   }
// }

module.exports = {
  paymentIntentTransactionController,
}