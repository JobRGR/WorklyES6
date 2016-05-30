import async from 'async'
import Next from '../utils/handler/helpers/next'
import Handler from '../utils/handler'
import {TestQuestion} from '../models/models'
import toObjectArray from '../utils/to_object_array'

let {nextItem, nextItems} = new Next('testQuestion')
let handler = new Handler('testQuestion', TestQuestion, false, false)


handler.addCompanyQuestion = (req, res, next) => {
  req.body.owner = req._company._id
  TestQuestion.addItem(req.body, (err, item) => nextItem(err, item, res, next))
}

handler.getQuestionsByCompany = (req, res, next) => TestQuestion.searchItems({
  owner: {$in: toObjectArray(res.companies)}, free:true
}, (err, questions) => nextItems(err, questions, res, next))

handler.getQuestionsById = (req, res, next) => TestQuestion.searchItems({owner : req.params.id, free : true},
  (err, questions) => nextItems(err, questions, res, next))

handler.getMyQuestions = (req, res, next) => TestQuestion.searchItems({owner : req._company._id},
  (err, questions) => nextItems(err, questions, res, next))

handler.setOwner = (req, res, next) => {
  req.body.testQuestions && req.body.testQuestions.forEach(item => item.owner = req._company._id)
  next()
}

export default handler
