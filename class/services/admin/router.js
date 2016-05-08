import express from 'express'
import Admin from './handler'

export default express
  .Router()
  .get('/admin-status', Admin.status, Admin.sendItem)
  .post('/admin-login', Admin.login, Admin.sendItem)

