import express from 'express'
import rest from '../../../utils/router/helpers/rest'

export default (name, handler) => {
  let app = express()
  let api = rest(handler)
  app
    .get(`/${name}-count`, handler.getCount)
    .get(`/${name}-random`, handler.getRandom, handler.sendItem)
    .post(`/${name}-add`, handler.addNew, handler.sendItem)
    .use(`/${name}`, api)
  return app
}
