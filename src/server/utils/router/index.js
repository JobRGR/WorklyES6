import express from 'express'
import Handler from '../handler'
import rest from './helpers/rest'

export default (name, handler, search = true, autocomplete = true) => {
  let app = express()
  let api = rest(handler)
  app
    .get(`/${name}-count`, handler.getCount)
    .get(`/${name}-random`, handler.getRandom, handler.sendItem)
    .use(`/${name}`, api)
  search && app.get(`/${name}-search`, handler.searchItem, handler.sendItem)
  autocomplete && app.get(`/${name}-autocomplete`, handler.autocomplete, handler.sendItems)
  return app
}
