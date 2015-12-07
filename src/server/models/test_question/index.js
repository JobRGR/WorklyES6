import mongoose from '../index'
import {removeItem, getCount, randomPopulate, getPopulate, getItem, updateItem, getRandom} from '../../utils/model/helpers'

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
    this.findById(id, (err, question) => {
        for (let key in  update)
            question[key] = (key=="owner") ?
                mongoose.Types.ObjectId(update[key]) :
                update[key]
        question.save(err => callback(err, question))
    })
}

schema.statics.getRandom = function(callback) {
    return randomPopulate.apply(this, [callback, foreignKeys])
}

schema.statics.searchItem = function(search, callback) {
    return searchPopulate.apply(this, [search, callback, foreignKeys])
}

schema.statics.getCount = getCount
schema.statics.removeItem = removeItem

export default mongoose.model('TestQuestion', schema)

