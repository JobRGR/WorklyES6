import mongoose from '../index'
import {removeItem, getCount, randomPopulate, getPopulate, searchPopulate, getItem, updateItem, getRandom} from '../../utils/model/helpers'

const foreignKeys = ['owner']

let {Schema} = mongoose

let schema = new Schema({
    question: {type: String, required: true},
    correct : {type: Number, required: true},
    answer: {type: [String], required: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true},
    free: {type: Boolean, required: true}
})

schema.statics.addItem = function ({question, correct, answer, owner, free}, callback) {
    const TestQuestion = this
    let testQuestion = new TestQuestion({question, correct, answer, owner, free})
    testQuestion.save(err => callback(err, testQuestion))
}

schema.statics.getItem = function (id, callback) {
    return getPopulate.apply(this, [id, callback, foreignKeys])
}

schema.statics.updateItem = function (id, update, callback) {
    return updateItem.apply(this, [id, update, callback, foreignKeys])
}

schema.statics.getRandom = function(callback) {
    return randomPopulate.apply(this, [callback, foreignKeys])
}

schema.statics.searchItems = function(search, callback) {
    return searchPopulate.apply(this, [search, callback, foreignKeys])
}

schema.statics.getCount = getCount
schema.statics.removeItem = removeItem

export default mongoose.model('TestQuestion', schema)

