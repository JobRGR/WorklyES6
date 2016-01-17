import express from 'express'
import Student from '../../handler/student'
import Dictionaries from '../../handler/dictionary'
import CompanyName from '../../handler/company_name'
import Education from '../../handler/education'
import Experience from '../../handler/experience'
import rest from '../../utils/router/helpers/rest'
import checkAdmin from '../../middleware/check/admin'
import checkStudent from '../../middleware/check/student'

export default express()
    .get('/student-count', Student.getCount)
    .get('/student-random', Student.getRandom, Student.sendItem)
    .get('/student-status', Student.getStudent, Student.sendItem)
    .get('/student-auto-login/:id', checkAdmin, Student.autoLogin, Student.sendItem)
    .post('/student-login', Student.login, Student.sendItem)
    .post('/student-search',
      Dictionaries['City'].searchItems,
      Dictionaries['Skill'].searchItems,
      Dictionaries['University'].searchItems,
      Dictionaries['Speciality'].searchItems,
      Dictionaries['Position'].searchItems,
      CompanyName.searchItems,
      Education.searchItems,
      Experience.searchItems,
      Student.searchItems,
      Student.sendItems
    )
    .put('/student-update',
      checkStudent,
      Student.initUser,
      Dictionaries['City'].addItem,
      Dictionaries['Skill'].addItems,
      Education.updateStudent,
      Experience.updateStudent,
      Student.updateItem,
      Student.sendItem
    )
    .put('/student-update/:id',
      Student.initUser,
      Dictionaries['City'].addItem,
      Dictionaries['Skill'].addItems,
      Education.updateStudent,
      Experience.updateStudent,
      Student.updateItem,
      Student.sendItem
    )
    .put('/student-password',
      checkStudent,
      Student.initUser,
      Student.changePassword
    )
    .put('/student-password/:id', Student.initUser, Student.changePassword)
    .put('/student-email',
      checkStudent,
      Student.initUser,
      Student.changeEmail
    )
    .put('/student-email/:id', Student.initUser, Student.changeEmail)
    .use('/student', rest(Student))

