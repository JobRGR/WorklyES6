import express from 'express'
import render from '../handler/render'
import University from '../handler/university'
import Speciality from '../handler/speciality'
import City from '../handler/city'
import Skill from '../handler/skill'

export default () => {
  let app = express()

  let api = express
    .Router()
    .use(University)
    .use(Speciality)
    .use(City)
    .use(Skill)

  app
    .use('/api', api)
    .get('/', render)
  return app
}