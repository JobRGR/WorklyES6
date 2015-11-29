import async from 'async'
import Next from '../utils/handler/helpers/next'
import Handler from '../utils/handler'
import {University, Speciality, Education} from '../models/models'
import toObjectArray from '../utils/to_object_array'

let {nextItem, nextItems} = new Next('education')
let handler = new Handler('education', Education, false, false)

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
    toObjectArray(req._student.education.map(({_id}) => _id)),
    err => nextItems(err, data, res, next))

  if (!req.body.education) nextItems(null, null, res, next)
  else if (!req.body.education.length) remove([])
  else Education.addArray(req.body.education,
      (err, educations) => err ? next(err) : remove(educations))
}

handler.updateStudent = (req, res, next) => {
  let remove = data => Education.removeArray(
    toObjectArray(req._student.education.map(({_id}) => _id)),
    err => nextItems(err, data, res, next))

  if (!req.body.education) return nextItems(null, null, res, next)
  if (!req.body.education.length) return remove([])

  async.map(req.body.education, (item, cb) => {
    async.parallel({
      university: (callback) => University.addItem({name: item.university}, callback),
      speciality: (callback) => Speciality.addItem({name: item.speciality}, callback)
    }, (err, {university, speciality}) => {
      item.university = university._id
      item.speciality = speciality._id
      cb(err, item)
    })
    }, (err, education) =>
      err ? next(err) : Education.addArray(req.body.education,
        (err, educations) => err ? next(err) : remove(educations))
  )
}

export default handler
