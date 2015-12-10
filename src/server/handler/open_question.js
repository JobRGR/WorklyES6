import async from 'async'
import Next from '../utils/handler/helpers/next'
import Handler from '../utils/handler'
import {OpenQuestion} from '../models/models'
import toObjectArray from '../utils/to_object_array'
import HttpError from '../utils/error'

let {nextItem, nextItems} = new Next('openQuestion')
let handler = new Handler('openQuestion', OpenQuestion, false, false)


handler.addCompanyQuestion = (req, res, next) => {
    let data = req.body
    data.owner = req._company.id
    OpenQuestion.addItem(data, (err, item) => nextItem(err, item, res, next))
}

handler.getQuestionsByCompany = (req, res, next) => {
    const search = {owner: {$in: toObjectArray(res.companies)}}
    OpenQuestion.searchItems(search, (err, questions) => nextItem(err, questions, res, next))
}

handler.getQuestionsById = (req, res, next) => {
    const search = {owner : req.params.id}
    OpenQuestion.searchItems(search, (err, questions) => nextItem(err, questions, res, next))
}

handler.getMyQuestions = (req, res, next) => {
    if (!req._company) nextItem(new HttpError(401, "Unauthorized."), null, res, next);
    else{
        const search = {owner : req._company._id}
        console.log(req.openQuestion)
        OpenQuestion.searchItems(search, (err, questions) => nextItem(err, questions, res, next))
    }
}

handler.getAllMyQuestions = (req, res, next) => {
    if (!req._company) nextItem(new HttpError(401, "Unauthorized."), null, res, next);
    else{
        let data = req._company.open_questions
        data.concat(req._company.test_questions)
        nextItem(null, data, res, next)
    }
}

export default handler
