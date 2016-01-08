import Next from '../utils/handler/helpers/next'
import async from 'async'
import {OpenQuestion, TestQuestion} from '../models/models'
import toObjectArray from '../utils/to_object_array'

export default {
  getAllMyQuestions : (req, res, next) => {
    async.parallel({
      openQuestions: cb => OpenQuestion.searchItems({owner: req._company._id}, cb),
      testQuestions: cb => TestQuestion.searchItems({owner: req._company._id}, cb)
    }, (err, result) => {
      if (err) return next(err)
      res.send(result)
    })
  },
  getAllQuestionsById : (req, res, next) => {
    async.parallel({
      openQuestions: cb => OpenQuestion.searchItems({owner: req.params.id, free:true}, cb),
      testQuestions: cb => TestQuestion.searchItems({owner: req.params.id, free:true}, cb)
    }, (err, result) => {
      if (err) return next(err)
      res.send(result)
    })
  }
}


