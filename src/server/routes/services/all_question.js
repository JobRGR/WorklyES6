import express from 'express'
import AllQuestion from '../../handler/all_question'
import rest from '../../utils/router/helpers/rest'

export default express()
  .get('/all-question-my', AllQuestion.getAllMyQuestions)
  .get('/all-question/:id', AllQuestion.getAllQuestionsById)

