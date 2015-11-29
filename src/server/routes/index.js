import express from 'express'
import render from '../handler/render'
import Dictionary from './services/dictionary'
import CompanyName from './services/company_name'
import Student from './services/student'
import {Experience, Education} from './services/education_experience'
import OpenQuestion from './services/open_question'

export default () => {
  let app = express()
  let api = express.Router()

  const services = ['City', 'Skill', 'University', 'Speciality', 'Position']
  services.forEach(item => api.use(Dictionary[item]))

  api
    .use(Education)
    .use(Experience)
    .use(CompanyName)
    .use(Student)
    .use(OpenQuestion)
  app
    .use('/api', api)
    .get('/', render)
  return app
}
