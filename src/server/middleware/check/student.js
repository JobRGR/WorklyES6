import HttpError from '../../utils/error'

export default (req, res, next) => next(!req._student ? new HttpError(401): null)