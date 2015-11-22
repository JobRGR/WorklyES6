import async from 'async'
import Next from '../utils/handler/helpers/next'
import Handler from '../utils/handler'
import {Student} from '../models/models'

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

export default handler
