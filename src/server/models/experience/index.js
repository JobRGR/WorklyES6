import mongoose from '../index'
import removeItem from '../../utils/model/remove'
import getCount from '../../utils/model/count'
import getRandom from '../../utils/model/random'
import getItem from '../../utils/model/get'
import updateItem from '../../utils/model/update'


let {Schema} = mongoose
let schema = new Schema({
  start: {type: Date},
  end: {type: Date},
  name: {type: String, required: true},
  about: {type: String},
  company: {type: String, required: true}
})

schema.statics.addItem = function ({start, end, name, about, company}, callback) {
  const Experience = this
  let experience = new Experience({start, end, name, about, company})
  experience.save(err => callback(err, experience))
}

schema.statics.getItem = getItem
schema.statics.getCount = getCount
schema.statics.removeItem = removeItem
schema.statics.getRandom = getRandom
schema.statics.updateItem = updateItem

export default mongoose.model('Experience', schema)

