import mongoose from 'mongoose'
import {removeItem, getCount} from 'model/helpers'
import deepPopulate from 'deep_populate'


let {Schema} = mongoose,
    ObjectId = mongoose.Schema.Types.ObjectId

let schema = new Schema({
  name: {type: String, required: true},
  about: {type: String},
  company: {type: ObjectId, required: true, ref: 'Company'},
  city: {type: ObjectId, ref: 'City'},
  skills: [{type: ObjectId, ref: 'Skill'}],
  subscribers: [{type: ObjectId, ref: 'Student'}]
}, {timestamps: true})

const foreignKeys = ['city', 'skills', 'subscribers', 'company.name', 'company.city']

schema.statics.addItem = function ({name, about, city, skills, company}, callback) {
  let Vacancy = this
  let vacancy = new Vacancy({name, about, city, skills, company})
  vacancy.save(err => callback(err, vacancy))
}

schema.statics.getItem = function (id, callback) {
  if (id) this
    .findById(id)
    .deepPopulate(foreignKeys)
    .exec(callback)
  else this
    .find({})
    .deepPopulate(foreignKeys)
    .sort({'updatedAt': -1})
    .exec(callback)
}

schema.statics.updateItem = function (id, update, callback) {
  for (let key in update)
    if (/name|about|city|skills/.test(key) == false)
      delete update[key]
  this.findById(id, (err, vacancy) => {
    for (let key in  update) {
      vacancy[key] = key == 'city' ? mongoose.Types.ObjectId(update[key]) : update[key]
    }
    vacancy.save(err => callback(err, vacancy))
  })
}

schema.statics.getRandom = function(callback) {
  this.count((err, count) => {
    if (err) return callback(err)
    const skip = Math.floor(Math.random() * count)
    this
      .findOne()
      .skip(skip)
      .deepPopulate(foreignKeys)
      .sort({'updatedAt': -1})
      .exec(callback)
  })
}

schema.statics.searchItem = function(search, callback) {
  this
    .find(search)
    .deepPopulate(foreignKeys)
    .sort({'updatedAt': -1})
    .exec(callback)
}

schema.statics.addSubscription = function(vacancy, subscriber, callback) {
  if (this.checkSubscription(vacancy, subscriber)) return callback(null, vacancy)
  vacancy.subscribers.push(subscriber)
  vacancy.save(err => callback(err, vacancy))
}

schema.statics.removeSubscription = function(vacancy, subscriber, callback) {
  if (!this.checkSubscription(vacancy, subscriber)) return callback(null, vacancy)
  vacancy.subscribers.pull(subscriber)
  vacancy.save(err => callback(err, vacancy))
}

schema.statics.checkSubscription = (vacancy, subscriber) => vacancy.subscribers.some(cur => cur.equals(subscriber))

schema.statics.getCount = getCount
schema.statics.removeItem = removeItem
schema.plugin(deepPopulate)

export default mongoose.model('Vacancy', schema)