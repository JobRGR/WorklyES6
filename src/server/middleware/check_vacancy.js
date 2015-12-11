import HttpError from '../utils/error'
import Vacancy from '../models/vacancy'

export default (req, res, next) =>{
  Vacancy.findById(req.params.id, (err, vacancy) => {
    if (err) return next(err)
    err = req._company.name._id.equals(vacancy.companyName) ? null : new HttpError(401, 'Permission deny!')
    next(err)
  })
}