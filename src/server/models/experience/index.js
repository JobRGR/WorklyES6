import mongoose from '../index'
import {removeItem, getCount, updateItem, randomTowPopulate, getTowPopulation, searchTowPopulation} from '../../utils/model/helpers'

let {Schema} = mongoose
let schema = new Schema({
  start: {type: Date},
  end: {type: Date},
  position: {type: mongoose.Schema.Types.ObjectId, ref: 'Position', required: true},
  company: {type: mongoose.Schema.Types.ObjectId, ref: 'CompanyName', required: true},
  about: {type: String}
})

schema.statics.addItem = function ({start, end, position, about, company}, callback) {
  const Experience = this
  let experience = new Experience({start, end, position, about, company})
  experience.save(err => callback(err, experience))
}

schema.statics.getItem = function (id, callback) {
  return getTowPopulation.apply(this, [id, callback, ['position', 'company']])
}

schema.statics.updateItem = function (id, update, callback) {
  return updateItem.apply(this, [id, update, callback, ['position', 'company']])
}

schema.statics.getRandom = function (callback) {
  return randomTowPopulate.apply(this, [callback, ['position', 'company']])
}

schema.statics.searchItems = function (search, callback) {
  return searchTowPopulation.apply(this, [search, callback, ['position', 'company']])
}

schema.statics.removeItem = removeItem
schema.statics.getCount = getCount

export default mongoose.model('Experience', schema)

