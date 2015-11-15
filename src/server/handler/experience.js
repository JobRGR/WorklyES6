import async from 'async'
import Next from '../utils/handler/helpers/next'
import Handler from '../utils/handler'
import {Position, CompanyName, Experience} from '../models/models'

let {nextItem, nextItems} = new Next('experience')
let handler = new Handler('experience', Experience, false, false)


let addModel = ({company, position}, cb) => {
  async.parallel({
    company: (callback) => CompanyName.addItem({name: company}, callback),
    position: (callback) => Position.addItem({name: position}, callback)
  }, cb)
}

handler.addOne = (req, res, next) => {
  let {start, end} = req.body
  addModel(req.body, (err, {company, position}) => {
    let data = {start, end, position: position._id, company: company._id}
    Experience.addItem(data, (err, experience) => nextItem(err, experience, req, next))
  })
}

handler.updateOne = (req, res, next) => {
  let {start, end} = req.body
  addModel(req.body, (err, {company, position}) => {
    let data = {start, end, position: position._id, company: company._id}
    Experience.updateItem(req.params.id, data, (err, experience) => nextItem(err, experience, req, next))
  })
}

export default handler
