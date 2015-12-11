import express from 'express'
import Vacancy from '../../handler/vacancy'
import Dictionaries from '../../handler/dictionary'
import CompanyName from '../../handler/company_name'
import checkVacancy from '../../middleware/check_vacancy'
import checkCompany from '../../middleware/check_company'

let router = (name, handler) =>
  express()
    .get(`/${name}-count`, handler.getCount)
    .get(`/${name}-random`, handler.getRandom, handler.sendItem)
    .post(`/${name}-search`,
      Dictionaries['City'].searchItems,
      Dictionaries['Skill'].searchItems,
      CompanyName.searchItems,
      handler.searchItems,
      handler.sendItems
    )
    .post(`/${name}-add`,
      checkCompany,
      Dictionaries['City'].addItem,
      Dictionaries['Skill'].addItems,
      handler.addItem,
      handler.sendItem
    )
    .put(`/${name}-update/:id`,
      checkCompany,
      checkVacancy,
      Dictionaries['City'].addItem,
      Dictionaries['Skill'].addItems,
      handler.updateItem,
      handler.sendItem
    )
    .get(`/${name}`, handler.getAll, handler.sendItems)
    .get(`/${name}/:id`, handler.getItem, handler.sendItem)
    .post(`/${name}`,    //admin permission
      Dictionaries['City'].addItem,
      Dictionaries['Skill'].addItems,
      CompanyName.addItem,
      handler.addItem,
      handler.sendItem
    )
    .put(`/${name}/:id`, //admin permission
      Dictionaries['City'].addItem,
      Dictionaries['Skill'].addItems,
      CompanyName.addItem,
      handler.updateItem,
      handler.sendItem
    )
    .delete(`/${name}/`, handler.removeAll)
    .delete(`/${name}/:id`, handler.removeItem)

export default router('vacancy', Vacancy)
