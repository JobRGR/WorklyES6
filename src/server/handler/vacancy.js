import pluralize from 'pluralize'
import Next from '../utils/handler/helpers/next'
import Handler from '../utils/handler'
import toObjectArray from '../utils/to_object_array'
import {Vacancy, Company} from '../models/models'

const name = 'vacancy'
const names = pluralize(name, 2)

let {nextItem, nextItems} = new Next(name)
let handler = new Handler(name, Vacancy)

handler.addItem = (req, res, next) => {
  let data = {}
  data.name = req.body.name
  data.about = req.body.about
  data.company  = req._company ? req._company._id: req.body.company
  if (res.city) data.city = res.city._id
  if (res.skills) data.skills = toObjectArray(res.skills)
  if (res.testQuestions) data.testQuestions = toObjectArray(res.testQuestions)
  if (res.openQuestions) data.openQuestions = toObjectArray(res.openQuestions)
  if (res.skills) data.skills = toObjectArray(res.skills)
  Vacancy.addItem(data, (err, vacancy) => nextItem(err, vacancy, res, next))
}

function getSearch(req, res, callback) {
  let search = {}
  if (req.body.name) search.name = req.body.name
  if (req.body.about) search.about = req.body.about
  if (res.cities && res.cities.length) search.city = {$in: toObjectArray(res.cities)}
  if (res.skills && res.skills.length) search.skills = {$in: toObjectArray(res.skills)}
  if (res.companyNames && res.companyNames.length){
    Company.searchItem({name: {$in: toObjectArray(res.companyNames)}}, (err, companies) => {
      search.company = {$in: toObjectArray(companies)}
      callback(search)
    })
  } else {
    callback(search)
  }
}

handler.searchItems = (req, res, next) => getSearch(req, res, search => {
  Vacancy.searchItem(search, (err, vacancies) => nextItems(err, vacancies, res, next))
})


handler.updateItem = (req, res, next) => {
  let data = ['name', 'about', 'testQuestions', 'openQuestions', 'testsResults'].reduce((memo, key) => {
    if (req.body[key]) memo[key] = req.body[key]
    return memo
  }, {})
  if (res.city) data.city = res.city._id
  if (res.skills) data.skills = toObjectArray(res.skills)
  Vacancy.updateItem(req.params.id, data, (err, vacancy) => nextItem(err, vacancy, res, next))
}

handler.addSubscription = (req, res, next) => {
  const subscriber = req._student._id
  const results = {
    ...req.body.testsResults,
    student: req._student._id
  }
  Vacancy.addSubscription(res[name], subscriber, results, (err, vacancy) => next(err))
}

handler.removeSubscription = (req, res, next) => {
  const id = req._student._id
  Vacancy.removeSubscription(res[name], id, (err, vacancy) => next(err))
}

handler.inspectItem = (req, res, next) => {
  res[name] = res[name].toObject()
  if (req._company){
    let id = req._company._id
    if (!res[name].company || (!id.equals(res[name].company) && !id.equals(res[name].company._id)))
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
    let id = req._company._id
    res[names].forEach(item => {
      if (!item.company || (!id.equals(item.company) && !id.equals(item.company._id))) {
        delete item.subscribers
      }
    })
  } else if (req._student) {
    let id = req._student._id
    res[names].forEach(item => {
      item.haveSubscription = item.subscribers
        .some(subscriber => id.equals(subscriber) || id.equals(subscriber._id))
      delete item.subscribers
    })
  }
  next()
}

export default handler
