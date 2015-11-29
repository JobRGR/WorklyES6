import mongoose from '../index'
import {removeItem, getCount, randomTowPopulate, getTowPopulation, getItem, updateItem, getRandom} from '../../utils/model/helpers'

let {Schema} = mongoose
let schema = new Schema({
    question: {type: String, required: true},
    answer: {type: String, required: true},
    //owner: {type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true},
    privat: {type: Boolean, required: true}
})

schema.statics.addItem = function ({question, answer, privat}, callback) {
    const OpenQuestion = this
    let openQuestion = new OpenQuestion({question, answer, privat})
    openQuestion.save(err => callback(err, openQuestion))
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

export default mongoose.model('OpenQuestion', schema)

