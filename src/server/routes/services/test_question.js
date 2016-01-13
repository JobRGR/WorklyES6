import express from 'express'
import OpenQuestion from '../../handler/open_question'
import TestQuestion from '../../handler/test_question'
import CompanyNameHandler from '../../handler/company_name'
import CompanyHandler from '../../handler/company'
import checkCompany from '../../middleware/check/company'
import rest from '../../utils/router/helpers/rest'


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

