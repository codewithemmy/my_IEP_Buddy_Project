const { Student } = require("./studentIEP.model")
const mongoose = require("mongoose")

class StudentRepository {
  static async create(payload) {
    return await Student.create(payload)
  }

  static async findStudentWithParams(studentPayload, select) {
    return await Student.find({ ...studentPayload }).select(select)
  }

  static async findSingleStudentWithParams(studentPayload, select) {
    const student = await Student.findOne({ ...studentPayload }).select(select)

    return student
  }

  static async validateStudent(studentPayload) {
    return Student.exists({ ...studentPayload })
  }

  static async findAllStudentsParams(studentPayload) {
    const { limit, skip, sort, ...restOfPayload } = studentPayload

    const student = await Student.find({ ...restOfPayload })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return student
  }

  static async updateStudentDetails(id, params) {
    return Student.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { $push: { ...params } } //returns details about the update
    )
  }

  static async updateStudentProfile(payload, params) {
    return Student.findOneAndUpdate({ ...payload }, { $set: { ...params } })
  }

  static async updateStudentById(id, params) {
    return Student.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { ...params },
      { new: true, runValidators: true }
    )
  }

  static async countsByStatus(query) {
    const studentCount = await Student.countDocuments().where({ ...query })
    return studentCount
  }

  static async deleteAccount(payload) {
    const deleteAccount = await Student.findOneAndDelete({
      ...payload,
    })

    return deleteAccount
  }
}

module.exports = { StudentRepository }
