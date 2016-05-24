import HttpError from '../utils/error'
import {Company, Student} from '../models/models'

export default (req, res, next) => {
  let {email, password} = req.body
  Student.authorize({email, password}, (err, student) => {
    if (!err && student) {
      req.session._student = student._id
      return res.send({student})
    }
    Company.authorize({email, password}, (err, company) => {
      if (!err && company) {
        req.session._company = company._id
        return res.send({company})
      }
      next(new HttpError(401))
    })
  })
}
