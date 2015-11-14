import Handler from '../utils/handler'
import Experience from '../models/experience'

let handler = new Handler('experience', Experience)

let nextItem = (err, experience, req, next) => {
  req.experience = experience
  next(err)
}

let nextItems = (err, experiences, req, next) => {
  req.experiences = experiences
  next(err)
}

handler.autocomplete = (req, res, next) => {
  let callback = (err, experiences) => nextItems(err, experiences, req, next)
  if (req.query.company) {
    Experience.autocomplete(req.query.company, callback, 'company')
  }
  else if (req.query.position) {
    Experience.autocomplete(req.query.position, callback, 'name')
  }
}

handler.searchItem = (req, res, next) => {
  let callback = (err, experience) => nextItem(err, experience, req, next)
  if (req.query.company) {
    Experience.searchItem(req.query.company, callback, 'company')
  }
  else if (req.query.position) {
    Experience.searchItem(req.query.position,callback, 'name')
  }
}

export default handler
