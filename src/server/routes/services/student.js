import express from 'express'
import Student from '../../handler/student'
import Education from '../../handler/education'
import Experience from '../../handler/experience'
import rest from '../../utils/router/helpers/rest'

let router = (name, handler) => {
  return express()
    .get(`/${name}-count`, handler.getCount)
    .get(`/${name}-random`, handler.getRandom, handler.sendItem)
    .get(`/${name}-status`, handler.getStudent, handler.sendItem)
    .post(`/${name}-login`, handler.login, handler.sendItem)
    .post(`${name}-search`, Education.searchItems, Experience.searchItems, handler.searchItems, handler.sendItems)
    .use(`/${name}`, rest(handler))
}

export default router('student', Student)
