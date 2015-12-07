import Company from '../models/company'

export default (req, res, next) => {
  req._company = res.locals._company = null
  if (!req.session._company) return next()
  Company.getItem(req.session._company, (err, _company) => {
    req._company = res.locals._company = _company
    next(err)
  })
}