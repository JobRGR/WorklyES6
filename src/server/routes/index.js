import express from 'express'
import render from '../handler/render'
import Dictionary from '../handler/dictionary'
import educationService from './services/education'

export default () => {
  let app = express()
  let api = express.Router()

  const services = ['City', 'Skill', 'University', 'Speciality']
  services.forEach(item => api.use(Dictionary[item]))

  api.use(educationService())

  app
    .use('/api', api)
    .get('/', render)
  return app
}