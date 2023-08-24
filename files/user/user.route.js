const { uploadManager } = require("../../utils/multer")
const { checkSchema } = require("express-validator")
const userRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")

//controller files
const {
  createUserController,
  userLoginController,
} = require("../user/controllers/user.controller")
const {
  IEPGoalController,
  generateImageController,
} = require("./controllers/profile.controller")

//routes
userRoute.route("/").post(createUserController)
userRoute.route("/login").post(userLoginController)
userRoute.route("/generate").post(generateImageController)
userRoute.route("/completion").post(IEPGoalController)

module.exports = userRoute
