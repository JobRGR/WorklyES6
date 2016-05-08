import HttpError from 'utils/error'
import {Company, Student} from 'models'

export let login = (req, res, next) => {
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

export let logout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) return next(err)
    res.send({logout: true})
  })
}


export let status = (req, res, next) => {
  let {_student: student, _company: company} = req
  let isLogin = (student || company)
  isLogin ? res.send({company, student}) : next(new HttpError(401))
}

