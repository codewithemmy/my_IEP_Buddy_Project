const mongoose = require("mongoose")
const {
  hashPassword,
  tokenHandler,
  verifyPassword,
  queryConstructor,
  sanitizePhoneNumber,
  generateOtp,
} = require("../../../utils")
const createHash = require("../../../utils/createHash")
const { UserSuccess, UserFailure } = require("../user.messages")
const { UserRepository } = require("../user.repository")
const {
  SubscriptionRepository,
} = require("../../subscription/subscription.repository")

const { LIMIT, SKIP, SORT } = require("../../../constants")
// const { sendMailNotification } = require("../../../utils/email")
class UserService {
  static async createUser(payload) {
    const { fullName, email } = payload

    const userExist = await UserRepository.validateUser({
      email,
    })

    if (userExist) return { success: false, msg: UserFailure.EXIST }

    const { otp, expiry } = generateOtp()

    //hash password
    const user = await UserRepository.create({
      ...payload,
      verificationOtp: otp,
      password: await hashPassword(payload.password),
    })

    if (!user._id) return { success: false, msg: UserFailure.CREATE }

    return {
      success: true,
      msg: UserSuccess.CREATE,
      otp: otp,
    }
  }

  static async userLogin(payload) {
    const { email, password } = payload

    //return result
    const userProfile = await UserRepository.findSingleUserWithParams({
      email: email,
    })

    if (!userProfile) return { success: false, msg: UserFailure.USER_EXIST }
    const activeSubscription = await SubscriptionRepository.fetch({
      userId: new mongoose.Types.ObjectId(userProfile._id),
    })

    if (!activeSubscription) {
      return {
        success: false,
        msg: `Not a subscribed user, complete your subscription to login`,
      }
    } else {
      const isPassword = await verifyPassword(password, userProfile.password)

      if (!isPassword) return { success: false, msg: UserFailure.PASSWORD }

      let token

      token = await tokenHandler({
        _id: userProfile._id,
        fullName: userProfile.fullName,
        email: userProfile.email,
        isAdmin: false,
      })

      const user = {
        _id: userProfile._id,
        fullName: userProfile.fullName,
        email: userProfile.email,
        status: userProfile.status,
        ...token,
      }

      //return result
      return {
        success: true,
        msg: UserSuccess.FETCH,
        data: user,
      }
    }
  }
}
module.exports = { UserService }
