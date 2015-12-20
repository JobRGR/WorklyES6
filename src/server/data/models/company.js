import Charlatan from 'charlatan'
import async from 'async'
import {City, CompanyName, Company} from '../../models/models'
import addArray from '../utils/add_array'
import random from '../utils/random'

let data = []

for (let i = 0; i < 100; i++)
  data.push({
    about: Charlatan.Lorem.text(3, 20, '\n'),
    password: '1111'
  })

export default cb => async.waterfall([
  callback => async.each(data, (item, next) => City.getRandom((err, city) => {
    item.city = city._id
    next()
  }), err => callback()),
  callback => CompanyName.getItem(null, (err, companyName) => {
    for (let i = 0; i < data.length; ++i) {
      let name = companyName[i].name
      data[i].name = companyName[i]._id
      data[i].email = `${name.toLowerCase().split(' ').join('.')}.${Charlatan.Internet.email()}`
      data[i].site = `${name.toLowerCase().split(' ').join('.')}.${Charlatan.Internet.domainSuffix()}`
    }
    callback()
  })
], err => addArray(Company, data, cb))
