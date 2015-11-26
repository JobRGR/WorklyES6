import async from 'async'
import Next from '../utils/handler/helpers/next'
import Handler from '../utils/handler'
import getDate from '../utils/get_date'
import {Position, CompanyName, Experience} from '../models/models'
import toObjectArray from '../utils/to_object_array'

let {nextItem, nextItems} = new Next('experience')
let handler = new Handler('experience', Experience, false, false)

handler.addOne = (req, res, next) => {
  let {start, end} = req.body
  let {position, company} = req
  let data = {start, end, position: position._id, company: company._id}
  Experience.addItem(data, (err, experience) => nextItem(err, experience, req, next))
}

handler.updateOne = (req, res, next) => {
  let {start, end} = req.body
  let {position, company} = req
  let data = {start, end, position: position._id, company: company._id}
  Experience.updateItem(req.params.id, data, (err, experience) => nextItem(err, experience, req, next))
}

handler.searchItems = (req, res, next) => {
  let search = {}
  if (req.companies.length) search.company = {$in: toObjectArray(req.companies)}
  if (req.positions.length) search.position = {$in: toObjectArray(req.positions)}
  if (!Object.keys(search).length) return nextItems(null, [], req, next)
  Experience.searchItems(search, (err, experiences) => nextItems(err, experiences, req, next))
}

handler.updateStudent = (req, res, next) => {
  let remove = data => Experience.removeArray(
    toObjectArray(req._student.experience.map(({_id}) => _id)),
    err => nextItems(err, data, req, next))

  if (!req.body.experience) nextItems(null, null, req, next)
  else if (req.body.experience.length) remove([])
  else Experience.addArray(req.body.experience,
      (err, experiences) => err ? next(err) : remove(experiences))
}

export default handler
