import HttpError from '../utils/error'

export default (req, res, next) => {
  let {_student: student, _company: company} = req
  let isLogin = (student || company)
  isLogin ? res.send({company, student}) : next(new HttpError(401))
}
