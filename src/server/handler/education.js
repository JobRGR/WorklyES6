import async from 'async'
import Next from '../utils/handler/helpers/next'
import Handler from '../utils/handler'
import {University, Speciality, Education} from '../models/models'

let {nextItem, nextItems} = new Next('education')
let handler = new Handler('education', Education)

let addModel = ({university, speciality}, cb) => {
  async.parallel({
    university: (callback) => University.addItem({name: university}, callback),
    speciality: (callback) => Speciality.addItem({name: speciality}, callback)
  }, cb)
}

handler.addOne = (req, res, next) => {
  let {start, end} = req.body
  addModel(req.body, (err, {university, speciality}) => {
    let data = {start, end, university: university._id, speciality: speciality._id}
    Education.addItem(data, (err, education) => nextItem(err, education, req, next))
  })
}

handler.updateOne = (req, res, next) => {
  let {start, end} = req.body
  addModel(req.body, (err, {university, speciality}) => {
    let data = {start, end, university: university._id, speciality: speciality._id}
    Education.updateItem(req.params.id, data, (err, education) => nextItem(err, education, req, next))
  })
}

export default handler
