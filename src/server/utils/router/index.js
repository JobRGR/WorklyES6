import express from 'express'
import Handler from '../handler'

export default (name, handler) => {
  let app = express()

  let api = express.Router()
    .get('/', handler.getAll, handler.sendItems)
    .get('/:id', handler.getItem, handler.sendItem)
    .post('/', handler.addItem, handler.sendItem)
    .put('/:id', handler.updateItem, handler.sendItem)
    .delete('/', handler.removeAll)
    .delete('/:id', handler.removeItem)

  app
    .get(`/${name}-count`, handler.getCount)
    .get(`/${name}-search`, handler.searchItem, handler.sendItem)
    .get(`/${name}-autocomplete`, handler.autocomplete, handler.sendItems)
    .get(`/${name}-random`, handler.getRandom, handler.sendItem)
    .use(`/${name}`, api)

  return app
}
