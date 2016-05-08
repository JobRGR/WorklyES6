import express from 'express'
import TestQuestion from './handler'
import rest from 'helpers/rest'


export default express()
  .get('/test-question-count', TestQuestion.getCount)
  .get('/test-question-random', TestQuestion.getRandom, TestQuestion.sendItem)
  .get('/test-question-company/:id', TestQuestion.getQuestionsById, TestQuestion.sendItems)
  .get('/test-question-my', checkCompany, TestQuestion.getMyQuestions, TestQuestion.sendItems)
  .post('/test-question-company',
  CompanyNameHandler.searchItems,
  CompanyHandler.searchItems,
  TestQuestion.getQuestionsByCompany,
  TestQuestion.sendItems
)
  .post('/test-question-add', TestQuestion.addCompanyQuestion, TestQuestion.sendItem)
  .use('/test-question', rest(TestQuestion))

