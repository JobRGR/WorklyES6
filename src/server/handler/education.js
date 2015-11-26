import async from 'async'
import Next from '../utils/handler/helpers/next'
import Handler from '../utils/handler'
import {University, Speciality, Education} from '../models/models'
import toObjectArray from '../utils/to_object_array'

let {nextItem, nextItems} = new Next('education')
let handler = new Handler('education', Education, false, false)

handler.addOne = (req, res, next) => {
  let {start, end} = req.body
  let {university, speciality} = req
  let data = {start, end, university: university._id, speciality: speciality._id}
  Education.addItem(data, (err, education) => nextItem(err, education, req, next))
}

handler.updateOne = (req, res, next) => {
  let {start, end} = req.body
  let {university, speciality} = req
  let data = {start, end, university: university._id, speciality: speciality._id}
  Education.updateItem(req.params.id, data, (err, education) => nextItem(err, education, req, next))
}

handler.searchItems = (req, res, next) => {
  let search = {}
  if (req.specialities.length) search.speciality = {$in: toObjectArray(req.specialities)}
  if (req.universities.length) search.university = {$in: toObjectArray(req.universities)}
  if (!Object.keys(search).length) return nextItems(null, [], req, next)
  Education.searchItems(search, (err, educations) => nextItems(err, educations, req, next))
}

handler.updateStudent = (req, res, next) => {
  let remove = data => Education.removeArray(
    toObjectArray(req.user.education.map(({_id}) => _id)),
    err => nextItems(err, data, req, next))

  if (!req.body.education) nextItems(null, null, req, next)
  else if (req.body.education.length) remove([])
  else Education.addArray(req.body.education,
      (err, educations) => err ? next(err) : remove(educations))
}

export default handler
