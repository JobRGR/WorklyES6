import HttpError from '../../utils/error'
import Vacancy from '../../models/vacancy'

export default (req, res, next) =>
  Vacancy.findById(req.params.id,
    (err, vacancy) => next(err ||
      (req._company._id.equals(vacancy.company) ? null : new HttpError(403))))
