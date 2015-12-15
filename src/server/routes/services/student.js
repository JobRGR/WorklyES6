import express from 'express'
import Student from '../../handler/student'
import Dictionaries from '../../handler/dictionary'
import CompanyName from '../../handler/company_name'
import Education from '../../handler/education'
import Experience from '../../handler/experience'
import rest from '../../utils/router/helpers/rest'
import checkStudent from '../../middleware/check_student'

let router = (name, handler) =>
  express()
    .get(`/${name}-count`, handler.getCount)
    .get(`/${name}-random`, handler.getRandom, handler.sendItem)
    .get(`/${name}-status`, handler.getStudent, handler.sendItem)
    .post(`/${name}-login`, handler.login, handler.sendItem)
    .post(`/${name}-search`,
      Dictionaries['City'].searchItems,
      Dictionaries['Skill'].searchItems,
      Dictionaries['University'].searchItems,
      Dictionaries['Speciality'].searchItems,
      Dictionaries['Position'].searchItems,
      CompanyName.searchItems,
      Education.searchItems,
      Experience.searchItems,
      handler.searchItems,
      handler.sendItems
    )
    .put(`/${name}-update`,
      checkStudent,
      handler.initUser,
      Dictionaries['City'].addItem,
      Dictionaries['Skill'].addItems,
      Education.updateStudent,
      Experience.updateStudent,
      Student.updateItem,
      handler.sendItem
    )
    .put(`/${name}-update/:id`,
      handler.initUser,
      Dictionaries['City'].addItem,
      Dictionaries['Skill'].addItems,
      Education.updateStudent,
      Experience.updateStudent,
      Student.updateItem,
      handler.sendItem
    )
    .put(`/${name}-password`,
      checkStudent,
      handler.initUser,
      handler.changePassword
    )
    .put(`/${name}-password/:id`, handler.initUser, handler.changePassword)
    .put(`/${name}-email`,
      checkStudent,
      handler.initUser,
      handler.changeEmail
    )
    .get(`/${name}-aggregation`, handler.aggregation)
    .put(`/${name}-email/:id`, handler.initUser, handler.changeEmail)
    .use(`/${name}`, rest(handler))

export default router('student', Student)
