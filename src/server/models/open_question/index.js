import mongoose from '../index'
import Company from '../company'
import CompanyName from '../company_name'
import {removeItem, getCount, randomPopulate, getPopulate, searchPopulate, getItem, updateItem, getRandom} from '../../utils/model/helpers'

const foreignKeys = ['owner']

let {Schema} = mongoose

let schema = new Schema({
    question: {type: String, required: true},
    answer: {type: String, required: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
    free: {type: Boolean, required: true}
}, {timestamps: true})

schema.statics.addItem = function ({question, answer, free, owner}, callback) {
    const OpenQuestion = this
    let openQuestion = new OpenQuestion({question, answer, free, owner})
    openQuestion.save(err => callback(err, openQuestion))
}

schema.statics.getItem = function (id, callback) {
    return getPopulate.apply(this, [id, callback, foreignKeys])
}

schema.statics.updateItem = function (id, update, callback) {
    delete update.owner
    return updateItem.apply(this, [id, update, callback, foreignKeys])
}

schema.statics.getRandom = function(callback) {
    return randomPopulate.apply(this, [callback, foreignKeys])
}

schema.statics.searchItems = function(search, callback) {
    return searchPopulate.apply(this, [search, callback, foreignKeys])
}

schema.statics.getQuestionsByName = function(name, callback) {

    var query  = CompanyName.where({name: name})
    query.findOne(function (err, kitten) {
        if (err) return callback(err);
        if (company) {

        }
    });
}

schema.statics.getCount = getCount
schema.statics.removeItem = removeItem

export default mongoose.model('OpenQuestion', schema)

