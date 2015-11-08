import mongoose from '../modules'

let  {Schema} = mongoose
const schema = new Schema({name: {type: String, unique: true, required: true}})

schema.statics.addItem = function (name, callback) {
  const Model = this
  Model.findOne({name}, (err, item = null) => {
    if (item) return callback(err, item)
    item = new Model({name})
    item.save(err => callback(err, item))
  })
}

schema.statics.getItem = function (id, callback) {
  if (id) this.findById(id, (err, item) => callback(item))
  else this
    .find({})
    .sort({'name': 1})
    .exec((err, items) => callback(items))
}

schema.statics.updateItem = function (id, name, callback) {
  this.findById(id, (err, item) => {
    if (err) return callback(err)
    item.name = name
    item.save(err => callback(err, item))
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
    .exec((err, items) => callback(items))
}

export default schema

