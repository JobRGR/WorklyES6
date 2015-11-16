import express from 'express'
import Student from '../../handler/student'
import rest from '../../utils/router/helpers/rest'

let router = (name, handler) => {
  return express()
    .get(`/${name}-count`, handler.getCount)
    .get(`/${name}-random`, handler.getRandom, handler.sendItem)
    .use(`/${name}`, rest(handler))
}

export default router('student', Student)
