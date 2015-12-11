import Next from '../utils/handler/helpers/next'
import Handler from '../utils/handler'
import getDate from '../utils/get_date'
import toObjectArray from '../utils/to_object_array'
import HttpError from '../utils/error'
import {Vacancy} from '../models/models'

let {nextItem, nextItems} = new Next('vacancy')
let handler = new Handler('vacancy', Vacancy)

handler.addItem = (req, res, next) => {
  let data = {}
  data.name = req.body.name
  data.about = req.body.about
  data.companyName  = req._company ? req._company.name: res.companyName ? res.companyName._id : null
  if (res.city) data.city = res.city._id
  if (res.skills) data.skills = toObjectArray(res.skills)
  Vacancy.addItem(data, (err, vacancy) => nextItem(err, vacancy, res, next))
}

handler.searchItems = (req, res, next) => {
  let search = {}
  if (req.body.name) search.name = req.body.name
  if (req.body.about) search.about = req.body.about
  if (res.companyNames && res.companyNames.length) search.companyName = {$in: toObjectArray(res.companyNames)}
  if (res.cities && res.cities.length) search.city = {$in: toObjectArray(res.cities)}
  if (res.skills && res.skills.length) search.skills = {$in: toObjectArray(res.skills)}
  Vacancy.searchItem(search, (err, vacancies) => nextItems(err, vacancies, res, next))
}

handler.updateItem = (req, res, next) => {
  let data = ['name', 'about'].reduce((memo, key) => {
    if (req.body[key]) memo[key] = req.body[key]
    return memo
  }, {})
  if (res.city) data.city = res.city._id
  if (res.companyName) data.companyName = res.companyName._id
  if (res.skills) data.skills = toObjectArray(res.skills)
  Vacancy.updateItem(req.params.id, data, (err, vacancy) => nextItem(err, vacancy, res, next))
}

export default handler
