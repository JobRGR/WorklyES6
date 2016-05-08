import Next from 'helpers/next'
import async from 'async'
import OpenQuestion from '../open_question/model'
import TestQuestion from '../test_question/model'
import HttpError from 'error'

function Search (query, res, next) {
  async.parallel({
    openQuestions: cb => OpenQuestion.searchItems(query, cb),
    testQuestions: cb => TestQuestion.searchItems(query, cb)
  }, (err, result) => {
    if (err) return next(err)
    res.send(result)
  })
}

export default {
  getAllMyQuestions : (req, res, next) => {
    if (!req._company) {
      let err = new HttpError(403, 'You must login as company')
      next(err)
      return
    }
    Search({owner: req._company._id}, res, next)
  },
  getAllQuestionsById : (req, res, next) => {
    Search({owner: req.params.id, free:true}, res, next)
  }
}


