import express from 'express'
import Handler from './handler'


export default (name, Module, handler = new Handler(name, Module)) => {
  let app = express()

  let api = express.Router()
    .get('/', handler.getAll)
    .get('/:id', handler.getItem)
    .post('/', handler.addItem)
    .put('/:id', handler.updateItem)
    .delete('/', handler.removeAll)
    .delete('/:id', handler.removeItem)
  
  app
    .get(`/${name}-count`, handler.getCount)
    .get(`/${name}-autocomplete`, handler.autocomplete)
    .use(`/${name}`, api)

  return app
}