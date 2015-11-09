import mongoose from '../index'
import removeItem from '../../utils/module/remove'
import getCount from '../../utils/module/count'


let {Schema} = mongoose
let schema = new Schema({
  start: {type: Date},
  end: {type: Date},
  speciality: {type: Schema.Types.ObjectId, ref: 'Speciality'},
  university: {type: Schema.Types.ObjectId, ref: 'University'}
})

schema.statics.addItem = function ({start, end, speciality, university}, callback) {
  const Education = this
  let education = new Education({start, end, speciality, university})
  education.save(err => callback(err, education))
}

schema.statics.getItem = function (id, callback) {
  if (id) this.findById(id, (err, education) => callback(education))
  else this
    .find({})
    .sort({'start': 1})
    .exec((err, educations) => callback(educations))
}

schema.statics.updateItem = function (id, edit, callback) {
  this.findById(id, (err, education) => {
    if (err) return callback(err)
    for (let key in  edit) if (edit[key]) education[key] = edit[key]
    education.save(err => callback(err, education))
  })
}

schema.statics.getCount = getCount
schema.statics.removeItem = removeItem

export default mongoose.model('Education', schema)

