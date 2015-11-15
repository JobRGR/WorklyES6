import mongoose from '../index'
import {removeItem, getCount} from '../../utils/model/helpers'

let {Schema} = mongoose
let schema = new Schema({
  email: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  dob: {type: Date},
  telephone: {type: String},
  about: {type: String},
  education: [{type: mongoose.Schema.Types.ObjectId, ref: 'Education'}],
  experience: [{type: mongoose.Schema.Types.ObjectId, ref: 'Experience'}],
  skill: [{type: mongoose.Schema.Types.ObjectId, ref: 'Skill'}],
  city: [{type: mongoose.Schema.Types.ObjectId, ref: 'City'}],
  date: {type: Date, required: true, default: Date.now}
})

schema.statics.addItem = function ({name, email, dob, telephone, about, education, experience, skill, city}, callback) {
  let Student = this
  let student = new Student({name, email, dob, telephone, about, education, experience, skill, city})
  student.save(err => callback(err, student))
}

schema.statics.getItem = function (id, callback) {
  if (id) this
    .findById(id)
    .populate('education')
    .populate('city')
    .populate('skill')
    .populate('experience')
    .exec(callback)
  else this
    .find({})
    .populate('education')
    .populate('city')
    .populate('skill')
    .populate('experience')
    .sort({'date': -1})
    .exec(callback)
}

schema.statics.updateItem = function (id, edit, callback) {
  this.findById(id, (err, student) => {
    let check = (key, obj) => /education|city|experience|skill/.test(key) ? mongoose.Types.ObjectId(obj[key]) : obj[key]
    if (err) return callback(err)
    for (let key in  edit)
      if (edit[key])
        student[key] = /education|city|experience|skill/.test(key) ? mongoose.Types.ObjectId(edit[key]) : edit[key]
    student.save(err => callback(err, student))
  })
}

schema.statics.getRandom = function(callback) {
  this.count((err, count) => {
    if (err) return callback(err)
    const skip = Math.floor(Math.random() * count)
    this
      .findOne()
      .skip(skip)
      .populate('education')
      .populate('city')
      .populate('skill')
      .populate('experience')
      .sort({'date': -1})
      .exec(callback)
  })
}

schema.statics.getCount = getCount
schema.statics.removeItem = removeItem

export default mongoose.model('Education', schema)

