import mongoose from '../index'
import {removeItem, getCount, randomPopulate, getPopulate, getItem, updateItem, getRandom} from '../../utils/model/helpers'

let {Schema} = mongoose
let schema = new Schema({
    question: {type: String, required: true},
    answer: {type: String, required: true},
    //owner: {type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true},
    free: {type: Boolean, required: true}
})

schema.statics.addItem = function ({question, answer, free}, callback) {
    const OpenQuestion = this
    let openQuestion = new OpenQuestion({question, answer, free})
    openQuestion.save(err => callback(err, openQuestion))
}

//schema.statics.getItem = function (id, callback) {
//    return getPopulation.apply(this, [id, callback, ['owner']])
//}
//
//schema.statics.updateItem = function (id, update, callback) {
//    return updateItem.apply(this, [id, update, callback, ['owner']])
//}
//
//schema.statics.getRandom = function (callback) {
//    return randomPopulate.apply(this, [callback, ['owner']])
//}

schema.statics.getRandom = getRandom
schema.statics.updateItem = updateItem
schema.statics.getItem = getItem
schema.statics.getCount = getCount
schema.statics.removeItem = removeItem

export default mongoose.model('OpenQuestion', schema)

