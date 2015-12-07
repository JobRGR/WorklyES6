import Student from '../models/student'

export default (req, res, next) => {
  req._student = res.locals._student = null
  if (!req.session._student) return next()
  Student.getItem(req.session._student, (err, _student) => {
    req._student = res.locals._student = _student
    next(err)
  })
}