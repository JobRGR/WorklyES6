import async from 'async'
import Next from '../utils/handler/helpers/next'
import Handler from '../utils/handler'
import {University, Speciality, Education} from '../models/models'
import toObjectArray from '../utils/to_object_array'

let {nextItem, nextItems} = new Next('education')
let handler = new Handler('education', Education, false, false)

let addModel = (university, speciality, cb) => async.parallel({
  university: callback => University.addItem(university, callback),
  speciality: callback => Speciality.addItem(speciality, callback)
}, cb)

handler.addOne = (req, res, next) => {
  let {start, end} = req.body
  let {university, speciality} = res
  let data = {start, end, university: university._id, speciality: speciality._id}
  Education.addItem(data, (err, education) => nextItem(err, education, res, next))
}

handler.updateOne = (req, res, next) => {
  let {start, end} = req.body
  let {university, speciality} = res
  let data = {start, end, university: university._id, speciality: speciality._id}
  Education.updateItem(req.params.id, data, (err, education) => nextItem(err, education, res, next))
}

handler.searchItems = (req, res, next) => {
  let search = {}
  if (res.specialities.length) search.speciality = {$in: toObjectArray(res.specialities)}
  if (res.universities.length) search.university = {$in: toObjectArray(res.universities)}
  if (!Object.keys(search).length) return nextItems(null, [], res, next)
  Education.searchItems(search, (err, educations) => nextItems(err, educations, res, next))
}

handler.updateStudent = (req, res, next) => {
  let remove = data => Education.removeArray(
    toObjectArray(req.student.educations.map(({_id}) => _id)),
    err => nextItems(err, data, res, next))

  if (!req.body.educations) nextItems(null, null, res, next)
  else if (!req.body.educations.length) remove([])
  else async.map(req.body.educations, ({start, end, university, speciality}, callback) =>
    addModel(university, speciality, (err, {university, speciality}) => callback(err, {
      start, end,
      university: university._id,
      speciality: speciality._id
    })),
    (err, educations) => err ? next(err) : Education.addArray(educations, (err, educations) => err ? next(err) : remove(educations)))
}

handler.aggregation = (req, res, next) => {
  Education.aggregate([
    {$match: {
      start: {$gt: new Date(req.query.min || 0, 0, 0)},
      end: {$lt: new Date((req.query.max || new Date().getFullYear()) + 1, 0, 0)}}
    },
    {$lookup: {from: 'universities', localField: 'university', foreignField: '_id', as: 'university'}},
    {$group: {
      _id: {university: "$university.name"},
      count: {$sum: 1}
    }},
    {$sort: { count: -1}}
  ]).exec((err, cities) =>
    res.send(cities.map(({_id, count}) => ({university: _id.university[0], total: count}))))
}

export default handler
