import express from 'express'

export default (name, Model) => {
  let app = express()

  let api = express.Router()
    .get('/', Model.getAll, Model.sendItems)
    .get('/:id', Model.getItem, Model.sendItem)
    .post('/', Model.addItem, Model.sendItem)
    .put('/:id', Model.updateItem, Model.sendItem)
    .delete('/', Model.removeAll)
    .delete('/:id', Model.removeItem)

  app
    .get(`/${name}-count`, Model.getCount)
    .get(`/${name}-random`, Model.getRandom, Model.sendItem)
    .post(`/${name}-add`, Model.addNew, Model.sendItem)
    .use(`/${name}`, api)

  return app
}
