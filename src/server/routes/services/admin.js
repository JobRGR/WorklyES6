import express from 'express'
import Admin from '../../handler/admin'

export default () => express.Router()
  .post('/login', Admin.getItem)
  .post('/status', Admin.getCount)
