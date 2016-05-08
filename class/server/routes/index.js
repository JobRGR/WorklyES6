import express from 'express'


import Dictionary from '../services/dictinary/dictinary_router'
import CompanyName from '../services/company_name/router'
import Company from '../services/company/router'
import Student from '../services/student/router'
import {Experience, Education} from '../services/education_experience/education_experience_router'
import OpenQuestion from '../services/open_question/router'
import TestQuestion from '../services/test_question/router'
import Statistic from '../services/statistic/roueter'
import AllQuestion from '../services/all_questions/router'
import Vacancy from '../services/vacancy/router'
import Admin from '../services/admin/router'

import {login, logout, status} from '../services/auth/handler'

const services = ['City', 'Skill', 'University', 'Speciality', 'Position']
let api = express.Router()
services.forEach(item => api.use(Dictionary[item]))
api
  .get('/logout', logout)
  .get('/status', status)
  .post('/login', login)
  .use(Education)
  .use(Experience)
  .use(CompanyName)
  .use(Company)
  .use(Student)
  .use(OpenQuestion)
  .use(TestQuestion)
  .use('/statistic', Statistic)
  .use(AllQuestion)
  .use(Vacancy)
  .use(Admin)

export default express()
  .use('/api', api)
  .get('/admin/*', render.admin)


