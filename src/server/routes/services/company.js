import express from 'express'
import Company from '../../handler/company'
import Dictionaries from '../../handler/dictionary'
import CompanyName from '../../handler/company_name'
import rest from '../../utils/router/helpers/rest'

let router = (name, handler) =>
  express()
    .get(`/${name}-count`, handler.getCount)
    .get(`/${name}-random`, handler.getRandom, handler.sendItem)
    .get(`/${name}-status`, handler.getCompany, handler.sendItem)
    .post(`/${name}-login`, handler.login, handler.sendItem)
    .post(`/${name}-search`,
      Dictionaries['City'].searchItems,
      CompanyName.searchItems,
      handler.searchItems,
      handler.sendItems
    )
    .put(`/${name}-password`, handler.changeMyPassword)
    .put(`/${name}-password/:id`, handler.changePassword)
    .put(`/${name}-email`, handler.changeMyEmail)
    .put(`/${name}-email/:id`, handler.changeEmail)
    .use(`/${name}`, rest(handler))

export default router('company', Company)
