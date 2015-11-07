import express from 'express'
import render from '../handler/render'
import University from '../handler/university'

export default () => {
  let app = express()

  let api = express.Router()

  let universityApi = express.Router()
    .get('/', University.getAll)
    .get('/:id', University.getItem)
    .put('/:id', University.updateItem)
    .delete('/', University.removeAll)
    .delete('/:id', University.removeItem)

  api.use('/university', universityApi)
  app
    .use('/api', api)
    .get('/', render)
  return app
}