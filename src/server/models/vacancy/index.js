import mongoose from '../index'
import {removeItem, getCount, randomPopulate, getPopulate, searchPopulate} from '../../utils/model/helpers'

let {Schema} = mongoose,
    ObjectId = mongoose.Schema.Types.ObjectId

let schema = new Schema({
  name: {type: String, required: true},
  about: {type: String},
  companyName: {type: ObjectId, required: true, ref: 'CompanyName'},
  city: {type: ObjectId, ref: 'City'},
  skills: [{type: ObjectId, ref: 'Skill'}],
  subscribers: [{type: ObjectId, ref: 'Student'}]
}, { timestamps: true})

const foreignKeys = ['city', 'skills', 'companyName', 'subscribers']

schema.statics.addItem = function ({name, about, city, skills, companyName}, callback) {
  let Vacancy = this
  let vacancy = new Vacancy({name, about, city, skills, companyName})
  vacancy.save(err => callback(err, vacancy))
}

schema.statics.getItem = function (id, callback) {
  return getPopulate.apply(this, [id, callback, foreignKeys])
}

schema.statics.updateItem = function (id, update, callback) {
  for (let key in update)
    if (/name|about|city|skills/.test(key) == false)
      delete update[key]
  this.findById(id, (err, vacancy) => {
    for (let key in  update) {
      vacancy[key] =
        key == 'city' ?
          mongoose.Types.ObjectId(update[key]) :
          update[key]
    }
    vacancy.save(err => callback(err, vacancy))
  })
}

schema.statics.addSubscription = function(id, subscriber, callback) {
  this.findById(id, (err, vacancy) => {
    vacancy.subscribers.push(subscriber)
    vacancy.save(err => callback(err, vacancy))
  })
}

schema.statics.getRandom = function(callback) {
  return randomPopulate.apply(this, [callback, foreignKeys])
}

schema.statics.searchItem = function(search, callback) {
  return searchPopulate.apply(this, [search, callback, foreignKeys])
}

schema.statics.getCount = getCount
schema.statics.removeItem = removeItem

export default mongoose.model('Vacancy', schema)