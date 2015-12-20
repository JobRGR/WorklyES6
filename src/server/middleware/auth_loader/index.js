import express from 'express'
import studentLoader from './lib/student'
import companyLoader from './lib/company'
import adminLoader from './lib/admin'

export default express()
  .use(studentLoader)
  .use(companyLoader)
  .use(adminLoader)
