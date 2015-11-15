import mongoose from '../index'
import {removeItem, getCount, updateItem} from '../../utils/model/helpers'

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
  if (id) this
    .findById(id)
    .populate('position')
    .populate('company')
    .exec(callback)
  else this
    .find({})
    .populate('position')
    .populate('company')
    .sort({'start': 1})
    .exec(callback)
}

schema.statics.updateItem = function (id, update, callback) {
  return updateItem.apply(this, [id, update, callback, ['position', 'company']])
}

schema.statics.getRandom = function(callback) {
  this.count((err, count) => {
    if (err) return callback(err)
    const skip = Math.floor(Math.random() * count)
    this
      .findOne()
      .skip(skip)
      .populate('position')
      .populate('company')
      .exec(callback)
  })
}

schema.statics.removeItem = removeItem
schema.statics.getCount = getCount

export default mongoose.model('Experience', schema)

