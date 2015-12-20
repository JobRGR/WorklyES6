import express from 'express'
import Admin from '../../handler/admin'

export default express.Router()
  .post('/admin-login', Admin.login, Admin.sendItem)
  .get('/admin-status', Admin.status, Admin.sendItem)
