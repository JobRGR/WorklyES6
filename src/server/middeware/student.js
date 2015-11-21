import Student from '../models/student'

export default (req, res, next) => {
  req.student = res.locals.student = null
  if (!req.session.student) return next()
  Student.findById(req.session.student, (err, student) => {
    if (err) return next(err)
    req.student = res.locals.student = student
    next()
  })
}