import express from 'express'
import Vacancy from '../../handler/vacancy'
import OpenQuestion from '../../handler/open_question'
import TestQuestion from '../../handler/test_question'
import Dictionaries from '../../handler/dictionary'
import CompanyName from '../../handler/company_name'
import checkStudent from '../../middleware/check/student'
import checkCompany from '../../middleware/check/company'
import checkVacancy from '../../middleware/check/vacancy'

let router = (name, handler) =>
  express()
    .get(`/${name}-count`, handler.getCount)
    .get(`/${name}-random`, handler.getRandom, handler.sendItem)
    .post(`/${name}-subscribe/:id`,
      checkStudent,
      handler.getItem,
      handler.addSubscription,
      handler.inspectItem,
      handler.sendItem
    )
    .get(`/${name}-unsubscribe/:id`,
      checkStudent,
      handler.getItem,
      handler.removeSubscription,
      handler.inspectItem,
      handler.sendItem
    )
    .post(`/${name}-search`,
      Dictionaries['City'].searchItems,
      Dictionaries['Skill'].searchItems,
      CompanyName.searchItems,
      handler.searchItems,
      handler.inspectItems,
      handler.sendItems
    )
    .post(`/${name}-add`,
      checkCompany,
      Dictionaries['City'].addItem,
      Dictionaries['Skill'].addItems,
      TestQuestion.setOwner,
      OpenQuestion.setOwner,
      TestQuestion.addItems,
      OpenQuestion.addItems,
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
    .get(`/${name}`,
      handler.getAll,
      handler.inspectItems,
      handler.sendItems
    )
    .get(`/${name}/:id`,
      handler.getItem,
      handler.inspectItem,
      handler.sendItem
    )
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
