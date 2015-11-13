import mongoose from '../index'
import removeItem from '../../utils/model/remove'
import getCount from '../../utils/model/count'


let {Schema} = mongoose
let schema = new Schema({
  start: {type: Date},
  end: {type: Date},
  speciality: {type: mongoose.Schema.Types.ObjectId, ref: 'Speciality'},
  university: {type: mongoose.Schema.Types.ObjectId, ref: 'University'}
})

schema.statics.addItem = function ({start, end, speciality, university}, callback) {
  const Education = this
  let education = new Education({
    start, end,
    speciality: speciality,
    university: university
  })
  education.save(err => callback(err, education))
}

schema.statics.getItem = function (id, callback) {
  if (id) this
    .findById(id)
    .populate('university')
    .populate('speciality')
    .exec((err, education) => callback(education))
  else this
    .find({})
    .populate('university')
    .populate('speciality')
    .sort({'start': 1})
    .exec((err, educations) => callback(educations))
}

schema.statics.updateItem = function (id, edit, callback) {
  this.findById(id, (err, education) => {
    if (err) return callback(err)
    for (let key in  edit)
      if (edit[key])
        education[key] = /speciality|university/.test(key) ? mongoose.Types.ObjectId(edit[key]) : edit[key]
    education.save(err => callback(err, education))
  })
}

schema.statics.getCount = getCount
schema.statics.removeItem = removeItem

schema.statics.getRandom = function(callback) {
  this.count((err, count) => {
    if (err) return callback(err)
    const skip = Math.floor(Math.random() * count)
    this
      .findOne()
      .skip(skip)
      .populate('university')
      .populate('speciality')
      .exec((err, item) => callback(err || item))
  })
}

export default mongoose.model('Education', schema)

