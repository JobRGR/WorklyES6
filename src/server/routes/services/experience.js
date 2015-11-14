import express from 'express'
import Experience from '../../handler/experience'


export default () => {
  let app = express()

  let api = express.Router()
    .get('/', Experience.getAll, Experience.sendItems)
    .get('/:id', Experience.getItem, Experience.sendItem)
    .post('/', Experience.addItem, Experience.sendItem)
    .put('/:id', Experience.updateItem, Experience.sendItem)
    .delete('/', Experience.removeAll)
    .delete('/:id', Experience.removeItem)

  app
    .get('/experience-count', Experience.getCount)
    .get('/experience-random', Experience.getRandom, Experience.sendItem)
    .post('/experience-add', Experience.addNew, Experience.sendItem)
    .use('/experience', api)

  return app
}