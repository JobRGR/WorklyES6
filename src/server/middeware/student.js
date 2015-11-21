import Student from '../models/student'

export default (req, res, next) => {
  req._student = res.locals._student = null
  if (!req.session._student) return next()
  Student.findById(req.session._student, (err, student) => {
    if (err) return next(err)
    req._student = res.locals._student = student
    next()
  })
}