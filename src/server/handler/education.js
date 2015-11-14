import express from 'express'
import async from 'async'
import Next from '../utils/handler/helpers/next'
import {University, Speciality, Education} from '../models/models'

let {nextItem, nextItems} = new Next('education')

class EducationHandler {
  getAll(req, res, next) {
    Education.getItem(null, (err, educations) => nextItems(err, educations, req, next))
  }

  getItem(req, res, next) {
    Education.getItem(req.params.id, (err, education) => nextItem(err, education, req, next))
  }

  addItem(req, res, next) {
    Education.addItem(req.body, (err, education) => nextItem(err, education, req, next))
  }

  updateItem(req, res, next) {
    Education.updateItem(req.params.id, req.body, (err, education) => nextItem(err, education, req, next))
  }

  removeAll(req, res, next) {
    Education.removeItem(null, err => res.send({ok: err || true}))
  }

  removeItem(req, res, next) {
    Education.removeItem(req.params.id, err => res.send({ok: err || true}))
  }

  getCount(req, res, next) {
    Education.getCount((err, count) => res.send({count}))
  }

  getRandom(req, res, next) {
    Education.getRandom((err, education) => nextItem(err, education, req, next))
  }

  addNew(req, res, next) {
    let {start, end} = req.body
    async.parallel({
      university: (callback) => University.addItem({name: req.body.university}, callback),
      speciality: (callback) => Speciality.addItem({name: req.body.speciality}, callback)
    }, (err, {university, speciality}) => {
      console.log(university, speciality)
      let data = {start, end, university: university._id, speciality: speciality._id}
      Education.addItem(data, (err, education) => {
        console.log(err, education)
        nextItem(err, education, req, next)
      })
    })
  }

  sendItem(req, res, next) {
    res.send({education: req.education})
  }

  sendItems(req, res, next) {
    res.send({educations: req.educations})
  }
}

export default new EducationHandler()
