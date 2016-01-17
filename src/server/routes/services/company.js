import express from 'express'
import Company from '../../handler/company'
import Dictionaries from '../../handler/dictionary'
import CompanyName from '../../handler/company_name'
import checkAdmin from '../../middleware/check/admin'
import checkCompany from '../../middleware/check/company'
import rest from '../../utils/router/helpers/rest'

export default express()
  .get('/company-count', Company.getCount)
  .get('/company-random', Company.getRandom, Company.sendItem)
  .get('/company-status', Company.getCompany, Company.sendItem)
  .get('/company-auto-login/:id', checkAdmin, Company.autoLogin, Company.sendItem)
  .post('/company-login', Company.login, Company.sendItem)
  .post('/company-search',
    Dictionaries['City'].searchItems,
    CompanyName.searchItems,
    Company.searchItems,
    Company.sendItems
  )
  .put('/company-update',
    checkCompany,
    Company.initUser,
    Dictionaries['City'].addItem,
    Company.updateItem,
    Company.sendItem
  )
  .put('/company-update/:id',
    Company.initUser,
    Dictionaries['City'].addItem,
    Company.updateItem,
    Company.sendItem
  )
  .put('/company-password',
    checkCompany,
    Company.initUser,
    Company.changePassword
  )
  .put('/company-password/:id', Company.initUser, Company.changePassword)
  .put('/company-email',
    checkCompany,
    Company.initUser,
    Company.changeEmail
  )
  .put('/company-email/:id', Company.initUser, Company.changeEmail)
  .use('/company', rest(Company))

