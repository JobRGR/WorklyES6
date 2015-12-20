import Admin from '../../../models/admin'

export default (req, res, next) => {
  req._admin = res.locals._admin = null
  if (!req.session._admin) return next()
  Admin.getItem(req.session._admin, (err, _admin) => {
    req._admin = res.locals._admin = _admin
    next(err)
  })
}