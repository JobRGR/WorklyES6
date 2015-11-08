import express from 'express'
import render from '../handler/render'
import University from '../handler/university'
import Speciality from '../handler/speciality'

export default () => {
  let app = express()

  let api = express.Router()
    .use(University)
    .use(Speciality)

  app
    .use('/api', api)
    .get('/', render)
  return app
}