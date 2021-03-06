import mongoose from '../index'
import {removeItem, getCount, updateItem, randomPopulate, getPopulate, searchPopulate, addArray, removeArray, getAllPopulate} from '../../utils/model/helpers'

let {Schema} = mongoose
let schema = new Schema({
  start: {type: Date, required: true},
  end: {type: Date, required: true},
  speciality: {type: mongoose.Schema.Types.ObjectId, ref: 'Speciality', required: true},
  university: {type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true}
}, {timestamps: true})

const foreignKeys = ['university', 'speciality']

schema.statics.addItem = function ({start, end, speciality, university}, callback) {
  const Education = this
  let education = new Education({start, end, speciality, university})
  education.save(err => callback(err, education))
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

schema.statics.getCount = getCount
schema.statics.removeItem = removeItem
schema.statics.addArray = addArray
schema.statics.removeArray = removeArray

export default mongoose.model('Education', schema)

