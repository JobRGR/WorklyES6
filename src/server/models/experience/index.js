import mongoose from '../index'
import {removeItem, getCount, getRandom, getItem, updateItem, autocomplite, searchItem} from '../../utils/model/helpers'

let {Schema} = mongoose
let schema = new Schema({
  start: {type: Date},
  end: {type: Date},
  name: {type: String, required: true},
  about: {type: String},
  company: {type: String, required: true}
})

schema.statics.addItem = function ({start, end, name, about, company}, callback) {
  console.log({start, end, name, about, company})
  const Experience = this
  let experience = new Experience({start, end, name, about, company})
  experience.save(err => callback(err, experience))
}

schema.statics.searchItem = searchItem
schema.statics.getRandom = getRandom
schema.statics.autocomplete = autocomplite
schema.statics.getItem = getItem
schema.statics.updateItem = updateItem

schema.statics.removeItem = removeItem
schema.statics.getCount = getCount

export default mongoose.model('Experience', schema)

