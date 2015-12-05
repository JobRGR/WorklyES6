import mongoose from '../../models'
import async from 'async'
import {removeItem, getCount, getRandom, getItem, updateItem, autocomplete, searchItem, addArray, removeArray} from './helpers'

let {Schema} = mongoose
let schema = new Schema({name: {type: String, unique: true, required: true}})

schema.statics.addItem = function (name, callback) {
  const Model = this
  Model.findOne({name}, (err, item) => {
    if (item) return callback(err, item)
    item = new Model({name})
    item.save(err => callback(err, item))
  })
}

schema.statics.searchItem = searchItem
schema.statics.autocomplete = autocomplete
schema.statics.getItem = getItem
schema.statics.getCount = getCount
schema.statics.removeItem = removeItem
schema.statics.getRandom = getRandom
schema.statics.updateItem = updateItem
schema.statics.addArray = addArray
schema.statics.removeArray = removeArray

export default schema
