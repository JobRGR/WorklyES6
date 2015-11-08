import mongoose from '../index'

let  {Schema} = mongoose
const schema = new Schema({name: {type: String, unique: true, required: true}})

schema.statics.addItem = function (name, callback) {
  const Speciality = this
  Speciality.findOne({name}, (err, item) => {
    if (item) return callback(err, item)
    let speciality = new Speciality({name})
    speciality.save(err => callback(err, speciality))
  })
}

schema.statics.getItem = function (id, callback) {
  if (id) this.findById(id, (err, speciality) => callback(speciality))
  else this
    .find({})
    .sort({'name': 1})
    .exec((err, specialities) => callback(specialities))
}

schema.statics.updateItem = function (id, name, callback) {
  this.findById(id, (err, speciality) => {
    if (err) return callback(err)
    speciality.name = name
    speciality.save(err => callback(err, speciality))
  })
}

schema.statics.getCount = function (callback) {
  this.count({}, (err, count) => callback(count))
}

schema.statics.removeItem = function (id, callback) {
  if (id) this.findByIdAndRemove(id, callback)
  else this.remove({}, callback)
}

schema.statics.autocomplete = function (name, callback) {
  this
    .find({name: new RegExp(`.*${name}.*`, 'i')})
    .sort({'date': -1})
    .limit(20)
    .exec((err, specialities) => callback(specialities))
}

export default mongoose.model('Speciality', schema)
