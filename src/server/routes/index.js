import express from 'express'
import render from '../handler/render'
import logout from '../handler/logout'
import Dictionary from './services/dictionary'
import CompanyName from './services/company_name'
import Company from './services/company'
import Student from './services/student'
import {Experience, Education} from './services/education_experience'
import OpenQuestion from './services/open_question'
import TestQuestion from './services/test_question'
import Statistic from './services/statistics'
import Vacancy from './services/vacancy'
import Admin from './services/admin'


export default () => {
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
    .use(Statistic)
    .use(Vacancy)
    .use(Admin)
  return express()
    .use('/api', api)
    .get('/', render)
    .get('/logout', logout)
}
