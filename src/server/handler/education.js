import async from 'async'
import Next from '../utils/handler/helpers/next'
import Handler from '../utils/handler'
import {University, Speciality, Education} from '../models/models'

let {nextItem, nextItems} = new Next('education')
let handler = new Handler('education', Education)

handler.addNew = (req, res, next) => {
  let {start, end} = req.body
  async.parallel({
    university: (callback) => University.addItem({name: req.body.university}, callback),
    speciality: (callback) => Speciality.addItem({name: req.body.speciality}, callback)
  }, (err, {university, speciality}) => {
    let data = {start, end, university: university._id, speciality: speciality._id}
    Education.addItem(data, (err, education) => nextItem(err, education, req, next))
  })
}

export default handler
