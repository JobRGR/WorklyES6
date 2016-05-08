import async from 'async'
import Next from 'helpers/next'
import Handler from 'handler'
import Experience from './model'

let {nextItem, nextItems} = new Next('experience')
let handler = new Handler('experience', Experience, false, false)

let addModel = (companyName, position, cb) => async.parallel({
  companyName: callback => CompanyName.addItem(companyName, callback),
  position: callback => Position.addItem(position, callback)
}, cb)


handler.addOne = (req, res, next) => {
  let {start, end} = req.body
  let {position, companyName} = res
  let data = {start, end, position: position._id, companyName: companyName._id}
  Experience.addItem(data, (err, experience) => nextItem(err, experience, res, next))
}

handler.updateOne = (req, res, next) => {
  let {start, end} = req.body
  let {position, companyName} = res
  let data = {start, end, position: position._id, companyName: companyName._id}
  Experience.updateItem(req.params.id, data, (err, experience) => nextItem(err, experience, res, next))
}

handler.searchItems = (req, res, next) => {
  let search = {}
  if (res.companyNames.length) search.companyName = {$in: toObjectArray(res.companyNames)}
  if (res.positions.length) search.position = {$in: toObjectArray(res.positions)}
  if (!Object.keys(search).length) return nextItems(null, [], res, next)
  Experience.searchItems(search, (err, experiences) => nextItems(err, experiences, res, next))
}

handler.updateStudent = (req, res, next) => {
  let remove = data => Experience.removeArray(
    toObjectArray(req.student.experiences.map(({_id}) => _id)),
    err => nextItems(err, data, res, next))

  if (!req.body.experiences) nextItems(null, null, res, next)
  else if (!req.body.experiences.length) remove([])
  else async.map(req.body.experiences, ({start, end, about, companyName, position}, callback) =>
    addModel(companyName, position, (err, {companyName, position}) => callback(err, {
      start, end, about,
      companyName: companyName._id,
      position: position._id
    })),
    (err, experiences) => err ? next(err) : Experience.addArray(experiences, (err, experiences) => err ? next(err) : remove(experiences)))
}

export default handler
