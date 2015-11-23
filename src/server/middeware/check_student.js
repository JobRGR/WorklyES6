import HttpError from '../utils/error'

export default (req, res, next) => {
  if (!req._student) {
    return next(new HttpError(403, 'forbidden_request'))
  }
  next()
}
