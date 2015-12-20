import express from 'express'
import OpenQuestion from '../../handler/open_question'
import CompanyNameHandler from '../../handler/company_name'
import CompanyHandler from '../../handler/company'
import checkCompany from '../../middleware/check/company'
import rest from '../../utils/router/helpers/rest'


export default express()
  .get('/open-question-count', OpenQuestion.getCount)
  .get('/open-question-random', OpenQuestion.getRandom, OpenQuestion.sendItem)
  .get('/open-question-company/:id', OpenQuestion.getQuestionsById, OpenQuestion.sendItems)
  .get('/open-question-my', checkCompany, OpenQuestion.getMyQuestions, OpenQuestion.sendItems)
  .post('/open-question-company',
    CompanyNameHandler.searchItems,
    CompanyHandler.searchItems,
    OpenQuestion.getQuestionsByCompany,
    OpenQuestion.sendItems
  )
  .post('/open-question-add', OpenQuestion.addCompanyQuestion, OpenQuestion.sendItem)
  .use('/open-question', rest(OpenQuestion))

