import async from 'async'
import Next from '../utils/handler/helpers/next'
import Handler from '../utils/handler'
import {Student} from '../models/models'

let {nextItem, nextItems} = new Next('student')
let handler = new Handler('student', Student)

handler.addItem = (req, res, next) => {
  let {email, password, name} = req.body
  Student.addItem( {email, password, name}, (err, student) => {
    if (!err && student) req.session.student = student._id
    nextItem(err, student, req, next)
  })
}

export default handler
