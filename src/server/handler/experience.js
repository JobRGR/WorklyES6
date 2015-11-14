import async from 'async'
import Next from '../utils/handler/helpers/next'
import Handler from '../utils/handler'
import {Position, CompanyName, Experience} from '../models/models'

let {nextItem, nextItems} = new Next('experience')
let handler = new Handler('experience', Experience)


handler.addNew = (req, res, next) => {
  let {start, end} = req.body
  async.parallel({
    company: (callback) => CompanyName.addItem({name: req.body.company}, callback),
    position: (callback) => Position.addItem({name: req.body.position}, callback)
  }, (err, {company, position}) => {
    let data = {start, end, position: position._id, company: company._id}
    Experience.addItem(data, (err, experience) => nextItem(err, experience, req, next))
  })
}

export default handler
