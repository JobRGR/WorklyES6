import express from 'express'
import async from 'async'
import Next from '../utils/handler/helpers/next'
import {Position, CompanyName, Experience} from '../models/models'

let {nextItem, nextItems} = new Next('experience')

class experienceHandler {
  getAll(req, res, next) {
    Experience.getItem(null, (err, experiences) => nextItems(err, experiences, req, next))
  }

  getItem(req, res, next) {
    Experience.getItem(req.params.id, (err, experience) => nextItem(err, experience, req, next))
  }

  addItem(req, res, next) {
    Experience.addItem(req.body, (err, experience) => nextItem(err, experience, req, next))
  }

  updateItem(req, res, next) {
    Experience.updateItem(req.params.id, req.body, (err, experience) => nextItem(err, experience, req, next))
  }

  removeAll(req, res, next) {
    Experience.removeItem(null, err => res.send({ok: err || true}))
  }

  removeItem(req, res, next) {
    Experience.removeItem(req.params.id, err => res.send({ok: err || true}))
  }

  getCount(req, res, next) {
    Experience.getCount((err, count) => res.send({count}))
  }

  getRandom(req, res, next) {
    Experience.getRandom((err, experience) => nextItem(err, experience, req, next))
  }

  addNew(req, res, next) {
    let {start, end} = req.body
    async.parallel({
      company: (callback) => CompanyName.addItem({name: req.body.company}, callback),
      position: (callback) => Position.addItem({name: req.body.position}, callback)
    }, (err, {company, position}) => {
      let data = {start, end, position: position._id, company: company._id}
      Experience.addItem(data, (err, experience) => nextItem(err, experience, req, next))
    })
  }

  sendItem(req, res, next) {
    res.send({experience: req.experience})
  }

  sendItems(req, res, next) {
    res.send({experiences: req.experiences})
  }
}

export default new experienceHandler()
