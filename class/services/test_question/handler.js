import async from 'async'
import Next from 'next'
import Handler from 'handler'
import TestQuestion from './model'

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

export default handler
