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
import AllQuestion from './services/all_question'
import Statistic from './services/statistics'
import Vacancy from './services/vacancy'
import Admin from './services/admin'


const services = ['City', 'Skill', 'University', 'Speciality', 'Position']
let api = express.Router()
services.forEach(item => api.use(Dictionary[item]))
api
  .get('/logout', logout)
  .use(Education)
  .use(Experience)
  .use(CompanyName)
  .use(Company)
  .use(Student)
  .use(OpenQuestion)
  .use(TestQuestion)
  .use(AllQuestion)
  .use(Statistic)
  .use(Vacancy)
  .use(Admin)

export default express()
  .use('/api', api)
  .get('/admin/*', render.admin)
  .get('/*', render.app)


