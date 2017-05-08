import mongoose from '../index'
import {removeItem, getCount, updateItem, randomPopulate, getPopulate, searchPopulate, addArray, removeArray, getAllPopulate} from '../../utils/model/helpers'

let {Schema} = mongoose
let schema = new Schema({
  skill: {type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true},
  complexity: {type: Number}
}, {timestamps: true})

const foreignKeys = ['skill']

schema.statics.addItem = function ({skill, complexity}, callback) {
  const SkillComplexity = this
  let skillComplexity = new SkillComplexity({skill, complexity})
  skillComplexity.save(err => callback(err, skillComplexity))
}

schema.statics.getItem = function (id, complexity, skip, limit) {
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

export default mongoose.model('SkillComplexity', schema)

