import async from 'async'
import Next from '../utils/handler/helpers/next'
import Handler from '../utils/handler'
import getDate from '../utils/get_date'
import {Student, City, Skill, Position, CompanyName, Education, University, Speciality} from '../models/models'

let {nextItem, nextItems} = new Next('student')
let handler = new Handler('student', Student)

let saveSession = (err, student, req, next) => {
  req.session._student = student._id
  nextItem(err, student, req, next)
}

handler.addItem = (req, res, next) => {
  let {email, password, name} = req.body
  Student.addItem( {email, password, name}, (err, student) => saveSession(err, student, req, next))
}
handler.login = (req, res, next) => Student.authorize(req.body, (err, student) => saveSession(err, student, req, next))
handler.getStudent = (req, res, next) => nextItem(null, req._student, req, next)

handler.searchItems = (req, res, next) => {
  let search = {}
  if (req.body.email) search.email = req.query.email
  if (req.body.age)  {
    search.dob = getDate(req.body.age.min, req.body.age.max)
  }
  if (req.body.name) search.name = req.body.name
  async.waterfall([
    callback => {
      if (req.body.city) City.searchItem(req.body.city, (err, city) => {
        search.city = {$in: city}
        callback()
      })
      else callback()
    },
    callback => {
      if (req.body.skill) Skill.searchItem(req.body.skill, (err, skill) => {
        search.skill = {$in: skill}
        callback()
      })
      else callback()
    }
  ], () => Student.searchItem(search, (err, students) => nextItems(err, students, req, next)))
}

export default handler
