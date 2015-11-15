import mongoose from '../index'
import {removeItem, getCount, updateItem} from '../../utils/model/helpers'

let {Schema} = mongoose
let schema = new Schema({
  start: {type: Date, required: true},
  end: {type: Date, required: true},
  speciality: {type: mongoose.Schema.Types.ObjectId, ref: 'Speciality', required: true},
  university: {type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true}
})

schema.statics.addItem = function ({start, end, speciality, university}, callback) {
  const Education = this
  let education = new Education({start, end, speciality, university})
  education.save(err => callback(err, education))
}

schema.statics.getItem = function (id, callback) {
  if (id) this
    .findById(id)
    .populate('university')
    .populate('speciality')
    .exec(callback)
  else this
    .find({})
    .populate('university')
    .populate('speciality')
    .sort({'start': 1})
    .exec(callback)
}

schema.statics.updateItem = function (id, update, callback) {
  return updateItem.apply(this, [id, update, callback, ['university', 'speciality']])
}

schema.statics.getRandom = function(callback) {
  this.count((err, count) => {
    if (err) return callback(err)
    const skip = Math.floor(Math.random() * count)
    this
      .findOne()
      .skip(skip)
      .populate('university')
      .populate('speciality')
      .exec(callback)
  })
}

schema.statics.getCount = getCount
schema.statics.removeItem = removeItem

export default mongoose.model('Education', schema)

