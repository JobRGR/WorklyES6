import express from 'express'
import render from '../handler/render'
import Dictionary from './services/dictionary'
import CompanyName from './services/company_name'
import {Experience, Education} from './services/education_experience'

export default () => {
  let app = express()
  let api = express.Router()

  const services = ['City', 'Skill', 'University', 'Speciality', 'Position']
  services.forEach(item => api.use(Dictionary[item]))

  api
    .use(Education)
    .use(Experience)
    .use(CompanyName)

  app
    .use('/api', api)
    .get('/', render)
  return app
}
