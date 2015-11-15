import express from 'express'
import Education from '../../handler/education'
import Experience from '../../handler/experience'
import rest from '../../utils/router/helpers/rest'

let router = (name, handler) => {
  let api = rest(handler)
  return express()
    .get(`/${name}-count`, handler.getCount)
    .get(`/${name}-random`, handler.getRandom, handler.sendItem)
    .post(`/${name}-add`, handler.addOne, handler.sendItem)
    .put(`/${name}-update/:id`, handler.updateOne, handler.sendItem)
    .use(`/${name}`, api)
}

export default {
  Experience: router('experience', Experience),
  Education: router('education', Education)
}