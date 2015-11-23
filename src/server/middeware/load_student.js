import jwt from 'jsonwebtoken'
import config from '../config'
import Student from '../models/student'

export default (req, res, next) => {
  req._student = res.locals._student = null
  let token = req.body.token|| req.query.token || req.cookies.token
  if (!token) return next()
  jwt.verify(token, config.secret, (err, decode) => {
    if (err) return next()
    Student.getItem(decode, (err, _student) => {
      req._student = res.locals._student = _student
      next(err)
    })
  })
}