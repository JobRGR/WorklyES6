import express from 'express'

export default (handler) => {
  return express.Router()
    .get('/', handler.getAll, handler.sendItems)
    .get('/:id', handler.getItem, handler.sendItem)
    .post('/', handler.addItem, handler.sendItem)
    .put('/:id', handler.updateItem, handler.sendItem)
    .delete('/', handler.removeAll)
    .delete('/:id', handler.removeItem)
}
