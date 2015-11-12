import express from 'express'
import Education from '../models/education'


class EducationHandler {
  getAll(req, res, next) {
    Education.getItem(null, educations => res.send({educations}))
  }

  getItem(req, res, next) {
    Education.getItem(req.params.id, education => res.send({education}))
  }

  addItem(req, res, next) {
    Education.addItem(req.body, (err, education) => res.send({err, education}))
  }

  updateItem(req, res, next) {
    Education.updateItem(req.params.id, req.body, (err, education) => res.send({err, education}))
  }

  removeAll(req, res, next) {
    Education.removeItem(null, err => res.send({ok: err || true}))
  }

  removeItem(req, res, next) {
    Education.removeItem(req.params.id, err => res.send({ok: err || true}))
  }

  getCount(req, res, next) {
    Education.getCount(count => res.send({count}))
  }

  getRandom(req, res, next) {
    Education.getRandom(education => res.send({education}))
  }
}

export default new EducationHandler()
