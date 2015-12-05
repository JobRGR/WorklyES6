import mongoose from '../index'
import {removeItem, getCount, updateItem, randomPopulate, getPopulate, searchPopulate, addArray, removeArray} from '../../utils/model/helpers'

let {Schema} = mongoose
let schema = new Schema({
  start: {type: Date},
  end: {type: Date},
  position: {type: mongoose.Schema.Types.ObjectId, ref: 'Position', required: true},
  companyName: {type: mongoose.Schema.Types.ObjectId, ref: 'CompanyName', required: true},
  about: {type: String}
})

schema.statics.addItem = function ({start, end, position, about, companyName}, callback) {
  const Experience = this
  let experience = new Experience({start, end, position, about, companyName})
  experience.save(err => callback(err, experience))
}

schema.statics.getItem = function (id, callback) {
  return getPopulate.apply(this, [id, callback, ['position', 'companyName']])
}

schema.statics.updateItem = function (id, update, callback) {
  return updateItem.apply(this, [id, update, callback, ['position', 'companyName']])
}

schema.statics.getRandom = function (callback) {
  return randomPopulate.apply(this, [callback, ['position', 'companyName']])
}

schema.statics.searchItems = function (search, callback) {
  return searchPopulate.apply(this, [search, callback, ['position', 'companyName']])
}

schema.statics.removeItem = removeItem
schema.statics.getCount = getCount
schema.statics.addArray = addArray
schema.statics.removeArray = removeArray

export default mongoose.model('Experience', schema)

