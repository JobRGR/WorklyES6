import express from 'express'
import studentLoader from 'student_loader'
import companyLoader from 'company_loader'
import adminLoader from 'admin_loader'

export default express()
  .use(studentLoader)
  .use(companyLoader)
  .use(adminLoader)
