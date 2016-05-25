import Charlatan from 'charlatan'
import async from 'async'
import {City, Skill, Company, Vacancy, Position} from '../../models/models'
import addArray from '../utils/add_array'
import random from '../utils/random'

let data = []

for (let i = 0; i < 50; i++) {
  data.push({
    name: '',
    about: Charlatan.Lorem.text(3, 20, '\n'),
    skills: []
  })
}

export default (cb) => async.waterfall([
  callback => async.each(data, (item, next) => Position.getRandom((err, position) => {
    item.name = position.name
    next()
  }), err => callback()),
  callback => async.each(data, (item, next) => City.getRandom((err, city) => {
    item.city = city._id
    next()
  }), err => callback()),
  callback => Company.getItem(null, (err, company) => {
    for (let i = 0; i < data.length; ++i) {
      data[i].company = company[i]._id
    }
    callback()
  }),
  callback => Skill.getItem(null, (err, skills) => {
    for (let i = 0; i < data.length; ++i) {
      let count = Math.floor(Math.random() * 8) + 2
      for (let j = 0; j < count; ++j)
        data[i].skills.push(random(skills)._id)
    }
    callback()
  })
], err => addArray(Vacancy, data, cb))
