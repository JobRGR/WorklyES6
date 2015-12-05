import Next from '../utils/handler/helpers/next'
import Handler from '../utils/handler'
import getDate from '../utils/get_date'
import toObjectArray from '../utils/to_object_array'
import {Company, City, CompanyName} from '../models/models'

let {nextItem, nextItems} = new Next('company')
let handler = new Handler('company', Company)

let saveSession = (err, company, req, res, next) => {
  req.session._company = company._id
  nextItem(err, company, res, next)
}

handler.addItem = (req, res, next) => {
  let {email, password, name} = req.body
  CompanyName.addItem(name, (err, companyName) =>
    Company.addItem({email, password, name: companyName._id}, (err, company) =>
      saveSession(err, company, req, res, next)))
}
handler.login = (req, res, next) => Company.authorize(req.body, (err, company) => saveSession(err, company, req, res, next))
handler.getCompany = (req, res, next) => nextItem(null, req._company, res, next)
handler.changePassword = (req, res, next) => Company.changePassword(req.body.password, err => res.send({ok: err || true}))
handler.changeEmail = (req, res, next) => Company.changeEmail(req.body.password, err => res.send({ok: err || true}))

handler.searchItems = (req, res, next) => {
  let search = {}
  if (req.body.email) search.email = req.body.email
  if (res.companyNames.length) search.name = {$in: toObjectArray(res.companyNames)}
  if (res.cities.length) search.city = {$in: toObjectArray(res.cities)}
  Company.searchItem(search, (err, companies) => nextItems(err, companies, res, next))
}

handler.updateItem = (req, res, next) => {
  let data = ['site', 'about'].reduce((memo, key) => {
    if (req.body[key]) memo[key] = req.body[key]
    return memo
  }, {})
  if (res.city) data.city = res.city._id
  if (res.companyName) data.companyName = res.companyName._id
  Company.updateItem(req.param.id, data, (err, company) => nextItem(err, company, res, next))
}

handler.changeMyPassword = (req, res, next) => Company.changeMyPassword(req._company, req.body.password, err => res.send({ok: err || true}))
handler.changePassword = (req, res, next) => Company.changePassword(req.params.id, req.body.password, err => res.send({ok: err || true}))
handler.changeMyEmail = (req, res, next) => Company.changeMyEmail(req._company, req.body.email, err => res.send({ok: err || true}))
handler.changeEmail = (req, res, next) => Company.changeEmail(req.params.id, req.body.email, err => res.send({ok: err || true}))

export default handler
