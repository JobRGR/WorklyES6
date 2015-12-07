import express from 'express'
import render from '../handler/render'
import Dictionary from './services/dictionary'
import CompanyName from './services/company_name'
import Company from './services/company'
import Student from './services/student'
import {Experience, Education} from './services/education_experience'
import OpenQuestion from './services/open_question'
import TestQuestion from './services/test_question'

export default () => {
  let app = express()
  let api = express.Router()

  const services = ['City', 'Skill', 'University', 'Speciality', 'Position']
  services.forEach(item => api.use(Dictionary[item]))

  api
    .use(Education)
    .use(Experience)
    .use(CompanyName)
    .use(Company)
    .use(Student)
    .use(OpenQuestion)
    .use(TestQuestion)
  app
    .use('/api', api)
    .get('/', render)
  return app
}
