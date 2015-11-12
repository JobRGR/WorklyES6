import express from 'express'
import Education from '../../handler/education'


export default () => {
  let app = express()

  let api = express.Router()
    .get('/', Education.getAll)
    .get('/:id', Education.getItem)
    .post('/', Education.addItem)
    .put('/:id', Education.updateItem)
    .delete('/', Education.removeAll)
    .delete('/:id', Education.removeItem)

  app
    .get(`/education-count`, Education.getCount)
    .get(`/education-random`, Education.getRandom)
    .use(`/education`, api)

  return app
}