import Charlatan from 'charlatan'
import async from 'async'
import Experience from '../../models/experience'
import addArray from '../utils/add_array'
import position from './position'
import company from './company'
import random from '../utils/random'

let data = []

for (let i = 0; i < 100; i++) {
  data.push({
    start: Charlatan.Date.birthday(4, 7),
    end: Charlatan.Date.birthday(0, 4),
    about: Charlatan.Lorem.text(4, 20, '\n'),
    name: random(position),
    company: random(company)
  })
}

export default (cb) => addArray(Experience, data, cb)