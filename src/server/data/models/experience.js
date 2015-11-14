import Charlatan from 'charlatan'
import async from 'async'
import Experience from '../../models/experience'
import Position from '../../models/position'
import addArray from '../utils/add_array'
import company from './company'
import random from '../utils/random'

let data = []

for (let i = 0; i < 100; i++) {
  data.push({
    start: Charlatan.Date.birthday(4, 7),
    end: Charlatan.Date.birthday(0, 4),
    about: Charlatan.Lorem.text(4, 20, '\n'),
    company: random(company)
  })
}

export default (cb) => async.each(data, (item, next) => Position.getRandom(position => {
  item.name = position._id
  next()
}), err => addArray(Experience, data, cb))
