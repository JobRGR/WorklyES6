import async from 'async'
import Next from '../utils/handler/helpers/next'
import Handler from '../utils/handler'
import {University, Speciality, Education} from '../models/models'

let {nextItem, nextItems} = new Next('education')
let handler = new Handler('education', Education, false, false)

let addModel = ({university, speciality}, cb) => {
  async.parallel({
    university: callback => University.addItem({name: university}, callback),
    speciality: callback => Speciality.addItem({name: speciality}, callback)
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

handler.searchItems = (req, res, next) => {
  if (req.body.education) {
    async.parallel({
      university: callback => University.searchItems(req.body.education.university, callback),
      speciality: callback => Speciality.searchItems(req.body.education.speciality, callback)
    }, (err, {speciality, university}) => {
      let search = {}
      if (speciality.length) search.speciality = {$in: speciality}
      if (university.length) search.university = {$in: university}
      if (!Object.keys(search).length) return nextItem(null, null, req, next)
      Education.searchItems(search, (err, educations) => nextItem(err, educations, req, next))
    })
  }
  else {
    nextItem(null, null, req, next)
  }
}


export default handler
