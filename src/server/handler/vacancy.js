import pluralize from 'pluralize'
import Next from '../utils/handler/helpers/next'
import Handler from '../utils/handler'
import getDate from '../utils/get_date'
import toObjectArray from '../utils/to_object_array'
import HttpError from '../utils/error'
import {Vacancy} from '../models/models'

const name = 'vacancy'
const names = pluralize(name, 2)

let {nextItem, nextItems} = new Next(name)
let handler = new Handler(name, Vacancy)

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

handler.addSubscription = (req, res, next) => {
  let id = req._student._id
  Vacancy.addSubscription(res[name], id, (err, vacancy) => next(err))
}

handler.removeSubscription = (req, res, next) => {
  let id = req._student._id
  Vacancy.removeSubscription(res[name], id, (err, vacancy) => next(err))
}

handler.inspectItem = (req, res, next) => {
  res[name] = res[name].toObject()
  if (req._company){
    let id = req._company.name._id
    if (!id.equals(res[name].companyName) && !id.equals(res[name].companyName._id))
      delete res[name].subscribers
  } else if (req._student) {
    let id = req._student._id
    res[name].haveSubscription = res[name].subscribers
      .some(subscriber => id.equals(subscriber) || id.equals(subscriber._id))
    delete res[name].subscribers
  }
  next()
}

handler.inspectItems = (req, res, next) => {
  res[names] = res[names].map(item => item.toObject())
  if (req._company){
    let id = req._company.name._id
    res[names].forEach(item => {
      if (!id.equals(item.companyName) && !id.equals(item.companyName._id)) {
        delete item.subscribers
      }
    })
  } else if (req._student) {
    let id = req._student._id
    res[names].forEach(item => {
      item.haveSubscription = item.subscribers
        .some(subscriber => id.equals(subscriber) || id.equals(subscriber._id))
    })
    delete item.subscribers
  }
  next()
}

export default handler
