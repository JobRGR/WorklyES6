import Next from '../utils/handler/helpers/next'
import Handler from '../utils/handler'
import getDate from '../utils/get_date'
import toObjectArray from '../utils/to_object_array'
import {Student, City, Skill, Position, CompanyName, Education, University, Speciality} from '../models/models'

let {nextItem, nextItems} = new Next('student')
let handler = new Handler('student', Student)

let saveSession = (err, student, req, res, next) => {
  req.session._student = student._id
  nextItem(err, student, res, next)
}

handler.addItem = (req, res, next) => {
  let {email, password, name} = req.body
  Student.addItem({email, password, name}, (err, student) => saveSession(err, student, req, res, next))
}
handler.login = (req, res, next) => Student.authorize(req.body, (err, student) => saveSession(err, student, req, res, next))
handler.getStudent = (req, res, next) => nextItem(null, req._student, res, next)
handler.changePassword = (req, res, next) => Student.changePassword(req.body.password, err => res.send({ok: err || true}))
handler.changeEmail = (req, res, next) => Student.changeEmail(req.body.password, err => res.send({ok: err || true}))

handler.searchItems = (req, res, next) => {
  let search = {}
  if (req.body.age) search.dob = getDate(req.body.age.min, req.body.age.max)
  if (req.body.email) search.email = req.body.email
  if (req.body.name) search.name = req.body.name
  if (res.cities.length) search.city = {$in: toObjectArray(res.cities)}
  if (res.skills.length) search.skill = {$in: toObjectArray(res.skills)}
  if (res.educations.length) search.education = {$in: toObjectArray(res.educations)}
  if (res.experiences.length) search.experience = {$in: toObjectArray(res.experiences)}
  Student.searchItem(search, (err, students) => nextItems(err, students, res, next))
}

handler.updateItem = (req, res, next) => {
  let data = ['dob', 'telephone', 'name', 'about'].reduce((memo, key) => {
    if (req.body[key]) memo[key] = req.body[key]
    return memo
  }, {})
  if (res.city) data.city = res.city._id
  if (res.skills) data.skills = toObjectArray(res.skills)
  if (res.educations) data.educations = toObjectArray(res.educations)
  if (res.experiences) data.experiences = toObjectArray(res.experiences)
  Student.updateItem(req.param.id, data, (err, student) => nextItem(err, student, res, next))
}

handler.changeMyPassword = (req, res, next) => Student.changeMyPassword(req._student, req.body.password, err => res.send({ok: err || true}))
handler.changePassword = (req, res, next) => Student.changePassword(req.params.id, req.body.password, err => res.send({ok: err || true}))
handler.changeMyEmail = (req, res, next) => Student.changeMyEmail(req._student, req.body.email, err => res.send({ok: err || true}))
handler.changeEmail = (req, res, next) => Student.changeEmail(req.params.id, req.body.email, err => res.send({ok: err || true}))

export default handler
