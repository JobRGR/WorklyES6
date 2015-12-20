import Next from '../utils/handler/helpers/next'
import HttpError from '../utils/error'
import Admin from '../models/admin'

let {nextItem} = new Next('admin')

let saveSession = (err, admin, req, res, next) => {
  if (!err && admin) req.session._admin = admin._id
  else if (!err) err = new HttpError(401)
  nextItem(err, admin, res, next)
}

export default {
  login: (req, res, next) => Admin.authorize(req.body, (err, admin) => saveSession(err, admin, req, res, next)),
  status: (req, res, next) => nextItem(null, req._admin, res, next),
  sendItem: (req, res, next) => res.send({admin: res.admin})
}
