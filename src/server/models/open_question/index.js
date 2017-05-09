import mongoose from '../index'
import Company from '../company'
import CompanyName from '../company_name'
import {removeItem, getCount, randomPopulate, getPopulate, searchPopulate, getItem, addArray, updateItem, getRandom, getAllPopulate} from '../../utils/model/helpers'

const foreignKeys = ['owner']

let {Schema} = mongoose

let schema = new Schema({
  question: {type: String, required: true},
  answer: {type: String, required: true},
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
  free: {type: Boolean, required: true}
}, {timestamps: true})

schema.statics.addItem = function ({question, answer, free = true, owner}, callback) {
  const OpenQuestion = this
  let openQuestion = new OpenQuestion({question, answer, free, owner})
  openQuestion.save(err => callback(err, openQuestion))
}

schema.statics.getItem = function (id, callback, skip, limit) {
  return getPopulate.apply(this, [id, callback, foreignKeys, skip, limit])
}

schema.statics.updateItem = function (id, update, callback, skip, limit) {
  return updateItem.apply(this, [id, update, callback, foreignKeys, skip, limit])
}

schema.statics.getRandom = function(callback) {
  return randomPopulate.apply(this, [callback, foreignKeys])
}

schema.statics.searchItems = function(search, callback) {
  return searchPopulate.apply(this, [search, callback, foreignKeys])
}

schema.statics.getQuestionsByName = function(name, callback) {
  const query  = CompanyName.where({name: name})
  query.findOne(cb)
}

schema.statics.getAll = function (callback) {
  return getAllPopulate.apply(this, [callback, foreignKeys])
}

schema.statics.getAll = function (callback) {
  return getAllPopulate.apply(this, [callback, foreignKeys])
}

schema.statics.getCount = getCount
schema.statics.addArray = addArray
schema.statics.removeItem = removeItem

export default mongoose.model('OpenQuestion', schema)

