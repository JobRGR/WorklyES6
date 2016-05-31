import async from 'async'
import Next from '../utils/handler/helpers/next'
import Handler from '../utils/handler'
import {OpenQuestion, TestQuestion} from '../models/models'
import toObjectArray from '../utils/to_object_array'

let {nextItem, nextItems} = new Next('openQuestion')
let handler = new Handler('openQuestion', OpenQuestion, false, false)


handler.addCompanyQuestion = (req, res, next) => {
  req.body.owner = req._company._id
  OpenQuestion.addItem(req.body, (err, item) => nextItem(err, item, res, next))
}

handler.getQuestionsByCompany = (req, res, next) =>
  OpenQuestion.searchItems({owner: {$in: toObjectArray(res.companies)}, free:true},
    (err, questions) => nextItems(err, questions, res, next))

handler.getQuestionsById = (req, res, next) =>
  OpenQuestion.searchItems({owner: req.params.id, free:true},
    (err, questions) => nextItems(err, questions, res, next))

handler.getMyQuestions = (req, res, next) =>
  OpenQuestion.searchItems({owner: req._company._id},
    (err, questions) => nextItems(err, questions, res, next))

handler.setOwner = (req, res, next) => {
  req.body.openQuestions && req.body.openQuestions.forEach(item => item.owner = req._company._id)
  next()
}

export default handler
