import express from 'express'
import AllQuestion from './handler'
import rest from 'helpers/rest'

export default express()
  .get('/all-questions', AllQuestion.getAllMyQuestions)
  .get('/all-questions/:id', AllQuestion.getAllQuestionsById)

