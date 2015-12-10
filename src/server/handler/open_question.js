import async from 'async'
import Next from '../utils/handler/helpers/next'
import Handler from '../utils/handler'
import {OpenQuestion} from '../models/models'
import toObjectArray from '../utils/to_object_array'

let {nextItem, nextItems} = new Next('openQuestion')
let handler = new Handler('openQuestion', OpenQuestion, false, false)

handler.getQuestionsByCompany = (req, res, next) => {
    const search = {owner : res.companies._id}
    OpenQuestion.searchItems(search, (err, questions) => nextItem(err, questions, res, next))
}

handler.getQuestionsById = (req, res, next) => {
    const search = {owner : req.params.id}
    OpenQuestion.searchItems(search, (err, questions) => nextItem(err, questions, res, next))
}

handler.getMyQuestionsById = (req, res, next) => {
    if (!req._company) nextItem("There is no authorized company", null, res, next);
    else{
        let data = req._company.open_questions
        nextItem(null, data, res, next)
    }
}

handler.getAllMyQuestionsById = (req, res, next) => {
    if (!req._company) nextItem("There is no authorized company");
    else{
        let data = req._company.open_questions
        data.concat(req._company.test_questions)
        nextItem(null, data, res, next)
    }
}

export default handler
