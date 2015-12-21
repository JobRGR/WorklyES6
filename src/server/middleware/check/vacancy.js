import HttpError from '../../utils/error'
import Vacancy from '../models/vacancy'

export default (req, res, next) =>
  Vacancy.findById(req.params.id,
    (err, vacancy) => next(err ||
      (req._company.name._id.equals(vacancy.companyName) ? null : new HttpError(403))))
