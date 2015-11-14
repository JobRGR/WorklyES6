import Handler from '../utils/handler'
import Experience from '../models/experience'

let handler = new Handler('experience', Experience)

handler.autocomplete = (req, res, next) => {
  if (req.query.company) {
    Experience.autocomplete(req.query.company, experiences => res.send({experiences}), 'company')
  }
  else if (req.query.position) {
    Experience.autocomplete(req.query.position, experiences => res.send({experiences}), 'name')
  }
}

handler.searchItem = (req, res, next) => {
  if (req.query.company) {
    Experience.searchItem(req.query.company, experience => res.send({experience}), 'company')
  }
  else if (req.query.position) {
    Experience.searchItem(req.query.position, experience => res.send({experience}), 'name')
  }
}

export default handler
