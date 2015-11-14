import express from 'express'
import Education from '../../handler/education'


export default () => {
  let app = express()

  let api = express.Router()
    .get('/', Education.getAll, Education.sendItems)
    .get('/:id', Education.getItem, Education.sendItem)
    .post('/', Education.addItem, Education.sendItem)
    .put('/:id', Education.updateItem, Education.sendItem)
    .delete('/', Education.removeAll)
    .delete('/:id', Education.removeItem)

  app
    .get('/education-count', Education.getCount)
    .get('/education-random', Education.getRandom, Education.sendItem)
    .post('/education-add', Education.addNew, Education.sendItem)
    .use(`/education`, api)

  return app
}