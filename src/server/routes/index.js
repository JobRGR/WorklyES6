import express from 'express'
import render from '../handler/render'
import University from '../handler/university'
import Speciality from '../handler/speciality'


export default () => {
  let app = express()

  let api = express.Router()

  let universityApi = express.Router()
    .get('/', University.getAll)
    .get('/:id', University.getItem)
    .post('/', University.addItem)
    .put('/:id', University.updateItem)
    .delete('/', University.removeAll)
    .delete('/:id', University.removeItem)
  api.use('/university', universityApi)
  api.get('/university-count', University.getCount)
  api.get('/university-autocomplete', University.autocomplete)

  let specialityApi = express.Router()
    .get('/', Speciality.getAll)
    .get('/:id', Speciality.getItem)
    .post('/', Speciality.addItem)
    .put('/:id', Speciality.updateItem)
    .delete('/', Speciality.removeAll)
    .delete('/:id', Speciality.removeItem)
  api.use('/speciality', specialityApi)
  api.get('/speciality-count', Speciality.getCount)
  api.get('/speciality-autocomplete', Speciality.autocomplete)

  app
    .use('/api', api)
    .get('/', render)
  return app
}