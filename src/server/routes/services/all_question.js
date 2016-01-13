import express from 'express'
import AllQuestion from '../../handler/all_question'
import rest from '../../utils/router/helpers/rest'

export default express()
  .get('/all-questions', AllQuestion.getAllMyQuestions)
  .get('/all-questions/:id', AllQuestion.getAllQuestionsById)

