const { default: mongoose } = require("mongoose")
const {
  hashPassword,
  tokenHandler,
  verifyPassword,
  queryConstructor,
  sanitizePhoneNumber,
  generateOtp,
} = require("../../../utils")
const createHash = require("../../../utils/createHash")
const { StudentRepository } = require("../studentIEP.repository")
const { LIMIT, SKIP, SORT } = require("../../../constants")
const {
  ProfileFailure,
  ProfileSuccess,
} = require("../messages/studentIEP.messages")

class StudentService {
  static async saveStudentService(payload, locals) {
    const { studentName, resultType } = payload

    const resultExist = await StudentRepository.findSingleStudentWithParams({
      teacher: new mongoose.Types.ObjectId(locals._id),
      studentName,
      resultType,
    })

    if (resultExist)
      return {
        success: false,
        msg: `This result already exist for the student, you can edit it`,
      }

    //hash password
    const student = await StudentRepository.create({
      ...payload,
      teacher: locals._id,
    })

    if (!student._id) return { success: false, msg: ProfileFailure.CREATE }

    return {
      success: true,
      msg: ProfileSuccess.CREATE,
      data: student,
    }
  }

  static async editStudentService(payload, id) {
    const { resultType } = payload

    const resultExist = await StudentRepository.findSingleStudentWithParams({
      _id: new mongoose.Types.ObjectId(id),
      resultType,
    })

    if (!resultExist)
      return {
        success: false,
        msg: `either your result type is not the same or id is invalid`,
      }

    //hash password
    const student = await StudentRepository.updateStudentById(id, {
      ...payload,
    })

    if (!student) return { success: false, msg: `Unable to edit Result` }

    return {
      success: true,
      msg: `Result update Successful`,
    }
  }

  static async getStudentService(userPayload, locals) {
    const { error, params, limit, skip, sort } = queryConstructor(
      userPayload,
      "createdAt",
      "Student"
    )
    if (error) return { success: false, msg: error }

    let teacher = { teacher: new mongoose.Types.ObjectId(locals._id) }

    const allStudent = await StudentRepository.findAllStudentsParams({
      ...params,
      limit,
      skip,
      sort,
      ...teacher,
    })

    if (allStudent.length < 1)
      return { success: false, msg: `No Student available currently` }

    return {
      success: true,
      msg: `student fetched successfully`,
      data: allStudent,
    }
  }
}

module.exports = { StudentService }
