import mongoose from '../index'
import {removeItem, getCount, updateItem, randomPopulate, getPopulate, searchPopulate, addArray, removeArray, getAllPopulate} from '../../utils/model/helpers'

let {Schema} = mongoose
let schema = new Schema({
  start: {type: Date},
  end: {type: Date},
  position: {type: mongoose.Schema.Types.ObjectId, ref: 'Position', required: true},
  companyName: {type: mongoose.Schema.Types.ObjectId, ref: 'CompanyName', required: true},
  about: {type: String}
}, {timestamps: true})

const foreignKeys = ['position', 'companyName']

schema.statics.addItem = function ({start, end, position, about, companyName}, callback) {
  const Experience = this
  let experience = new Experience({start, end, position, about, companyName})
  experience.save(err => callback(err, experience))
}

schema.statics.getItem = function (id, callback, skip, limit) {
  return getPopulate.apply(this, [id, callback, foreignKeys, skip, limit])
}

schema.statics.updateItem = function (id, update, callback) {
  return updateItem.apply(this, [id, update, callback, foreignKeys])
}

schema.statics.getRandom = function (callback) {
  return randomPopulate.apply(this, [callback, foreignKeys])
}

schema.statics.searchItems = function (search, callback, skip, limit) {
  return searchPopulate.apply(this, [search, callback, foreignKeys, skip, limit])
}

schema.statics.getAll = function (callback) {
  return getAllPopulate.apply(this, [callback, foreignKeys])
}

schema.statics.removeItem = removeItem
schema.statics.getCount = getCount
schema.statics.addArray = addArray
schema.statics.removeArray = removeArray

export default mongoose.model('Experience', schema)

