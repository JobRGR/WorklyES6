import Charlatan from 'charlatan'
import async from 'async'
import {City, Skill, Company, Vacancy} from '../../models/models'
import addArray from '../utils/add_array'
import random from '../utils/random'

let data = []

for (let i = 0; i < 50; i++) {
  data.push({
    name: Charlatan.Lorem.sentence(5),
    about: Charlatan.Lorem.text(3, 20, '\n'),
    skills: []
  })
}

export default (cb) => async.waterfall([
  callback => async.each(data, (item, next) => City.getRandom((err, city) => {
    item.city = city._id
    next()
  }), err => callback()),
  callback => Company.getItem(null, (err, company) => {
    for (let i = 0; i < data.length; ++i) {
      data[i].companyName = company[i].name._id
    }
    callback()
  }),
  callback => Skill.getItem(null, (err, skills) => {
    for (let i = 0; i < data.length; ++i) {
      let count = Math.floor(Math.random() * 10)
      for (let j = 0; j < count; ++j)
        data[i].skills.push(random(skills)._id)
    }
    callback()
  })
], err => addArray(Vacancy, data, cb))
