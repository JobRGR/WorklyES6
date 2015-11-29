import mongoose from '../index'
import {removeItem, getCount, randomTowPopulate, getTowPopulation, getItem, updateItem, getRandom} from '../../utils/model/helpers'

let {Schema} = mongoose
let schema = new Schema({
    question: {type: String, required: true},
    rightAns : {type: Number, required: true},
    answer: {type: [String], required: true},
    //owner: {type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true},
    privat: {type: Boolean, required: true} //"privat", not "private". Word "private" is reserved
})

schema.statics.addItem = function ({question, answer, rightAns, privat}, callback) {
    const TestQuestion = this
    let testQuestion = new TestQuestion({question, answer, rightAns, privat})
    testQuestion.save(err => callback(err, testQuestion))
}

//schema.statics.getItem = function (id, callback) {
//    return getPopulation.apply(this, [id, callback, ['company']])
//}
//
//schema.statics.updateItem = function (id, update, callback) {
//    return updateItem.apply(this, [id, update, callback, ['company']])
//}
//
//schema.statics.getRandom = function (callback) {
//    return randomPopulate.apply(this, [callback, ['company']])
//}

schema.statics.getRandom = getRandom
schema.statics.updateItem = updateItem
schema.statics.getItem = getItem
schema.statics.getCount = getCount
schema.statics.removeItem = removeItem

export default mongoose.model('TestQuestion', schema)

