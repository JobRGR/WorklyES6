import Charlatan from 'charlatan'
import async from 'async'
import {Position, Experience, CompanyName} from '../../models/models'
import addArray from '../utils/add_array'
import random from '../utils/random'

let data = []

for (let i = 0; i < 100; i++) {
  data.push({
    start: Charlatan.Date.birthday(4, 7),
    end: Charlatan.Date.birthday(0, 4),
    about: Charlatan.Lorem.text(4, 20, '\n')
  })
}

export default (cb) => async.waterfall([
  callback => async.each(data, (item, next) => Position.getRandom((err, position) => {
    item.position = position._id
    next()
  }), err => callback()),
  callback => async.each(data, (item, next) => CompanyName.getRandom((err, company) => {
    item.company = company._id
    next()
  }), err => callback())
], err => addArray(Experience, data, cb))
