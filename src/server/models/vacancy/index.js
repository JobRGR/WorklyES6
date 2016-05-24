import mongoose from '../index'
import {removeItem, getCount} from '../../utils/model/helpers'
import deepPopulate from '../../utils/deep_populate'


let {Schema} = mongoose,
    ObjectId = mongoose.Schema.Types.ObjectId

let schema = new Schema({
  name: {type: String, required: true},
  about: {type: String},
  company: {type: ObjectId, required: true, ref: 'Company'},
  city: {type: ObjectId, ref: 'City'},
  skills: [{type: ObjectId, ref: 'Skill'}],
  subscribers: [{type: ObjectId, ref: 'Student'}],
  testsResults: [{
    student: {type: ObjectId, ref:'Student'},
    testAnswers: [{type: Number}],
    openAnswers: [{type: String}],
    rating: Number
  }],
  testQuestions: [{
    type: ObjectId,
    ref: 'TestQuestion'
  }],
  openQuestions: [{
    type: ObjectId,
    ref: 'OpenQuestion'
  }],
}, {timestamps: true})

const foreignKeys = ['city', 'skills', 'subscribers', 'company.name', 'company.city', 'testResults.student', 'testQuestions', 'openQuestions']

schema.statics.addItem = function ({name, about, city, skills, company, testQuestions = [], openQuestions = []}, callback) {
  let Vacancy = this
  let vacancy = new Vacancy({name, about, city, skills, company, testQuestions, openQuestions})
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
  console.log(update)
  for (let key in update)
    if (/name|about|city|skills|testQuestions|openQuestions|testsResults/.test(key) == false)
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

schema.statics.addResult = function(vacancy, result, callback) {
  vacancy.testResults.push(result)
  vacancy.save(err => callback(err, vacancy))
}
schema.statics.removeResult = function(vacancy, result, callback) {
  vacancy.testResults.pull(result)
  vacancy.save(err => callback(err, vacancy))
}

schema.statics.getCount = getCount
schema.statics.removeItem = removeItem
schema.plugin(deepPopulate)

export default mongoose.model('Vacancy', schema)