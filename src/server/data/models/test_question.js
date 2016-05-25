import async from 'async'
import addArray from '../utils/add_array'
import {TestQuestion, Company} from '../../models/models'

let data = []
for (let i = 0; i<100; i++){
    let index = Math.round(Math.random() * questions.length - 1)
    let ansNumber = Math.round(Math.random() * 4 + 1)
    data.push({})
    data[i].question = questions[index]
    data[i].correct = Math.round(Math.random() * ansNumber)
    data[i].answer = []
    for (let j = 0; j <= ansNumber; j++) {
        index = Math.round(Math.random() * (answers.length - 1) + 1)
        data[i].answer.push(answers[index])
    }
    data[i].free = Math.round(Math.random())
}

export default (cb) => {
    async.waterfall([
        callback => async.each(data, (item, next) => Company.getRandom((err, company) => {
            item.owner = company._id
            next()
        }), err => callback()),
        callback => addArray(TestQuestion, data, err => cb())
    ], err => addArray(TestQuestion, data, cb))
}