import async from 'async'
import Models from '../../models/models'
import addArray from '../utils/add_array'
import {answers, questions} from '../models/open_question'
import {TestQuestion} from '../../models/models'

export default (cb) => {
    let data = []
    for (let i = 0; i<100; i++){
        let ind = Math.round(Math.random()*questions.length-1)
        data.push({});
        data[i].question = questions[ind]
        let ansNumber = Math.round(Math.random()*4 + 1)
        data[i].rightAns = Math.round(Math.random()*ansNumber-1)
        data[i].answer = [];
        for (let j = 0; j<ansNumber; j++) {
            ind = Math.round(Math.random() * (answers.length-1)+1)
            data[i].answer.push(answers[ind]);
        }
        data[i].privat = Math.round(Math.random())

    }
    addArray(TestQuestion, data, err => cb())
}