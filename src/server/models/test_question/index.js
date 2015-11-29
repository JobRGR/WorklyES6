import mongoose from '../index'
import {removeItem, getCount, randomPopulate, getPopulate, getItem, updateItem, getRandom} from '../../utils/model/helpers'

let {Schema} = mongoose
let schema = new Schema({
    question: {type: String, required: true},
    correct : {type: Number, required: true},
    answer: {type: [String], required: true},
    //owner: {type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true},
    free: {type: Boolean, required: true}
})

schema.statics.addItem = function ({question, answer, correct, free}, callback) {
    const TestQuestion = this
    let testQuestion = new TestQuestion({question, answer, correct, free})
    testQuestion.save(err => callback(err, testQuestion))
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

export default mongoose.model('TestQuestion', schema)

