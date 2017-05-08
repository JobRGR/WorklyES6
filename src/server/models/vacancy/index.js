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
    correct: Number
  }],
  testQuestions: [{
    type: ObjectId,
    ref: 'TestQuestion'
  }],
  openQuestions: [{
    type: ObjectId,
    ref: 'OpenQuestion'
  }]
}, {timestamps: true})

const foreignKeys = [
  'city',
  'skills',
  'subscribers',
  'company.name',
  'company.city',
  'testsResults.student',
  'testQuestions',
  'openQuestions',

  'subscribers.educations.speciality',
  'subscribers.experiences.companyName',
  'subscribers.educations.university',
  'subscribers.experiences.position',
  'subscribers.city',
  'subscribers.skills',

  'testsResults.student.educations.speciality',
  'testsResults.student.experiences.companyName',
  'testsResults.student.educations.university',
  'testsResults.student.experiences.position',
  'testsResults.student.city',
  'testsResults.student.skills'
]

schema.statics.addItem = function ({name, about, city, skills, company, testQuestions = [], openQuestions = []}, callback) {
  let Vacancy = this
  let vacancy = new Vacancy({name, about, city, skills, company, testQuestions, openQuestions})
  vacancy.save(err => callback(err, vacancy))
}

schema.statics.getItem = function (id, callback, skip = 0, limit = 100) {
  if (id) this
    .findById(id)
    .deepPopulate(foreignKeys)
    .exec(callback)
  else this
    .find({})
    .skip(skip)
    .limit(limit)
    .deepPopulate(foreignKeys)
    .sort({'updatedAt': -1})
    .exec(callback)
}

schema.statics.updateItem = function (id, update, callback) {
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

schema.statics.searchItem = function(search, callback, skip = 0, limit = 100) {
  this
    .find(search)
    .skip(skip)
    .limit(limit)
    .deepPopulate(foreignKeys)
    .sort({'updatedAt': -1})
    .exec(callback)
}

schema.statics.addSubscription = function(vacancy, subscriber, result, callback) {
  if (this.checkSubscription(vacancy, subscriber)) {
    return callback(null, vacancy)
  }
  result.correct = (
    (result.testAnswers || []).filter((correct, index) => correct == vacancy.testQuestions[index].correct).length +
    (result.openAnswers || []).filter((answer, index) => answer == vacancy.openQuestions[index].answer).length
  )
  vacancy.testsResults.push(result)
  vacancy.subscribers.push(subscriber)
  vacancy.save(err => callback(err, vacancy))
}

schema.statics.removeSubscription = function(vacancy , subscriber, callback) {
  if (!this.checkSubscription(vacancy, subscriber)) {
    return callback(null, vacancy)
  }
  vacancy.testsResults.pull({student: mongoose.Types.ObjectId(subscriber)})
  vacancy.subscribers.pull(subscriber)
  vacancy.save(err => callback(err, vacancy))
}

schema.statics.getAll = function (cb) {
  const limit = 100
  let data = []
  this.count({}, (err, count) => {
    let loop = []
    let lastSkip = Math.ceil(count / limit)
    for (let i = 0; i <= lastSkip; i++) {
      loop.push(callback => {
        this
          .find({})
          .skip(i * limit)
          .limit(limit)
          .deepPopulate(foreignKeys)
          .exec((err, res) => {
            !err && data.push(...res)
            callback()
          })
      })
    }
    async.waterfall(loop, () => cb(data))
  })
}

schema.statics.checkSubscription = (vacancy, subscriber) => vacancy.subscribers.some(cur => cur.equals(subscriber))

schema.statics.getCount = getCount
schema.statics.removeItem = removeItem
schema.plugin(deepPopulate)

export default mongoose.model('Vacancy', schema)