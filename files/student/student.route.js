const { uploadManager } = require("../../utils/multer")
const { checkSchema } = require("express-validator")
const studentRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")
const {
  saveStudentController,
  editStudentController,
  getStudentController,
} = require("./controllers/studentIEP.controller")

studentRoute.use(isAuthenticated)

//routes
studentRoute.route("/").post(saveStudentController)
studentRoute.route("/:id").patch(editStudentController)
studentRoute.route("/").get(getStudentController)

module.exports = studentRoute
