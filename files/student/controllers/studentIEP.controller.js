const { BAD_REQUEST, SUCCESS } = require("../../../constants/statusCode")
const { responseHandler } = require("../../../core/response")
const { manageAsyncOps, fileModifier } = require("../../../utils")
const { CustomError } = require("../../../utils/errors")
const { StudentService } = require("../services/studentIEP.service")

const saveStudentController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    StudentService.saveStudentService(req.body, res.locals.jwt)
  )
  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const editStudentController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    StudentService.editStudentService(req.body, req.params.id)
  )
  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const getStudentController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    StudentService.getStudentService(req.query, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  saveStudentController,
  editStudentController,
  getStudentController,
}
