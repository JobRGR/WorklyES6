import mongoose from '../index'
import {removeItem, getCount, randomPopulate, getPopulate, searchPopulate, toJson} from '../../utils/model/helpers'

let {Schema} = mongoose,
    ObjectId = mongoose.Schema.Types.ObjectId

let schema = new Schema({
  name: {type: String, required: true},
  about: {type: String, required: true},
  companyName: {type: ObjectId, required: true, ref: 'CompanyName'},
  city: {type: ObjectId, required: true, ref: 'City'},
  skill: [{type: ObjectId, required: true, ref: 'Skill'}],
  subscriber: [{type: ObjectId, ref: 'Student'}],
  openQuestion: [{type: ObjectId, ref: 'OpenQuestion'}],
  testQuestion: [{type: ObjectId, ref: 'TestQuestion'}]
}, { timestamps: true})

const foreignKeys = ['city', 'skill', 'companyName', 'subscriber', 'openQuestion', 'testQuestion']

schema.statics.addItem = function ({name, about, city, skill, companyName, openQuestion, testQuestion}, callback) {
  let Vacancy = this
  let vacancy = new Vacancy({name, about, city, skill, companyName, openQuestion, testQuestion})
  vacancy.save(err => callback(err, vacancy))
}

schema.statics.getItem = function (id, callback) {
  return getPopulate.apply(this, [id, callback, foreignKeys])
}

schema.statics.updateItem = function (id, update, callback) {
  for (let key in update)
    if (/name|about|city|skill|openQuestion|testQuestion/.test(key) == false)
      delete update[key]
  this.findById(id, (err, vacancy) => {
    for (let key in  update) {
      vacancy[key] =
        /skill|openQuestion|testQuestion/.test(key) ?
          update[key].map(value => mongoose.Types.ObjectId(value)) :
          key == 'city' ?
            mongoose.Types.ObjectId(update[key]) :
            update[key]
    }
    vacancy.save(err => callback(err, vacancy))
  })
}

schema.statics.addSubscription = function(id, subscriber, callback) {
  this.findById(id, (err, vacancy) => {
    vacancy.subscriber.push(subscriber)
    vacancy.save(err => callback(err, vacancy))
  })
}

schema.statics.getRandom = function(callback) {
  return randomPopulate.apply(this, [callback, foreignKeys])
}

schema.statics.searchItem = function(search, callback) {
  return searchPopulate(this, [search, callback, foreignKeys])
}

schema.methods.toJSON = toJson
schema.statics.getCount = getCount
schema.statics.removeItem = removeItem

export default mongoose.model('Vacancy', schema)