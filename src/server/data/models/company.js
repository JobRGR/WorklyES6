import Charlatan from 'charlatan'
import async from 'async'
import faker from 'faker'
import {City, CompanyName, Company} from '../../models/models'
import mongoose from 'mongoose'
import searchImage from '../../utils/search_image'
import addArray from '../utils/add_array'

let data = []
let dataNames = []

for (let i = 0; i < 100; i++)
  data.push({
    about: Charlatan.Lorem.text(3, 20, '\n'),
    password: '1111'
  })

export default cb => async.waterfall([
  callback => CompanyName.getItem(null, (err, companyName) => {
    for (let i = 0; i < data.length; ++i) {
      let name = companyName[i].name
      dataNames.push(name)
      data[i].name = mongoose.Types.ObjectId(companyName[i]._id)
      data[i].email = `${name.toLowerCase().replace(/\./g, "").replace(/\,/g, "").split(' ').join('')}.${Charlatan.Internet.email()}`
      data[i].site = `${name.toLowerCase().replace(/\./g, "").replace(/\,/g, "").split(' ').join('')}.${Charlatan.Internet.domainSuffix()}`
    }
    callback()
  }),
  callback => {
    async.each(data, (item, next) => searchImage(item.email.split('.')[0], image => {
      item.avatar = image || faker.image.abstract(200, 200)
      next()
    }), err => callback())
  },
  callback => async.each(data, (item, next) => City.getRandom((err, city) => {
    item.city = mongoose.Types.ObjectId(city._id)
    next()
  }), err => callback())
], err => addArray(Company, data, cb))
