import {assert} from 'chai'
import request from 'supertest'
import count from '../helpers/count'
import deleteItem from '../helpers/delete'
import superagent from 'superagent'

export default (url) => {

  let companyUser = superagent.agent()
  let studentUser = superagent.agent()

  const path = '/api/vacancy'

  let tmpCompany = {name: 'InsSolutions', password: '1111', email: 'ins_solutins@somnia.com'},
    tmpStudent = {name: 'Alex Loud', password: '1111', email: 'alex@gmail.com'},
    tmpVacancy = {name: 'Web Full Stack', about: 'some description', city: 'Київ', skills: ['Web', 'JavaScript']},
    tmpModel = null,
    tmpCompanyId = null,
    tmpStudentId = null,
    list = [],
    openQuestion1 = null,
    openQuestion2 = null,
    testQuestion1 = null,
    testQuestion2 = null,
    index = null

  let auth = {
    login: {
      company: () => {
        it('.set company/save cookies', done => {
          companyUser
            .post(`${url}/api/company`)
            .send(tmpCompany)
            .end((err, res) => {
              tmpCompanyId = res.body.company._id
              assert.equal(res.status, 200)
              assert.property(res.body, 'company')
              assert.property(res.body.company, 'name')
              assert.property(res.body.company, 'email')
              assert.equal(res.body.company.email, tmpCompany.email)
              assert.notProperty(res.body.company, 'salt')
              assert.notProperty(res.body.company, 'hashedPassword')
              done()
            })
        })
      },
      student: () => {
        it('.set student/save cookies', done => {
          studentUser
            .post(`${url}/api/student`)
            .send(tmpStudent)
            .end((err, res) => {
              tmpStudentId = res.body.student._id
              assert.equal(res.status, 200)
              assert.property(res.body, 'student')
              assert.equal(res.body.student.name, tmpStudent.name)
              assert.equal(res.body.student.email, tmpStudent.email)
              assert.notProperty(res.body.student, 'salt')
              assert.notProperty(res.body.student, 'hashedPassword')
              done()
            })
        })
      }
    },
    logout: {
      company: () => {
        it('.delete company/reset cookies', done => deleteItem(url, `/api/company/${tmpCompanyId}`, done))
      },
      student: () => {
        it('.delete student/reset cookies', done => deleteItem(url, `/api/student/${tmpStudentId}`, done))
      }
    }

  }

  describe('vacancy tests', () => {
    auth.login.company()

    it('.get list', done => {
      request(url)
        .get(path)
        .end((err, res) => {
          list = res.body.vacancies || []
          assert.equal(res.status, 200)
          assert.property(res.body, 'vacancies')
          assert.isAbove(res.body.vacancies.length, 0)
          done()
        })
    })

    it('.get item by id', done => {
      const index = Math.floor(list.length * Math.random())
      request(url)
        .get(`${path}/${list[index]._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'vacancy')
          assert.property(res.body.vacancy, 'name')
          assert.property(res.body.vacancy, 'about')
          assert.property(res.body.vacancy, 'createdAt')
          assert.property(res.body.vacancy, 'updatedAt')
          assert.property(res.body.vacancy, 'company')
          assert.property(res.body.vacancy, 'city')
          assert.property(res.body.vacancy, 'skills')
          assert.property(res.body.vacancy, 'openQuestions')
          assert.property(res.body.vacancy, 'testQuestions')
          assert.property(res.body.vacancy, 'testsResults')
          assert.equal(res.body.vacancy.name, list[index].name)
          assert.equal(res.body.vacancy.about, list[index].about)
          assert.equal(res.body.vacancy._id, list[index]._id)
          assert.deepEqual(res.body.vacancy.openQuestions, list[index].openQuestions)
          assert.deepEqual(res.body.vacancy.testQuestions, list[index].testQuestions)
          assert.deepEqual(res.body.vacancy.testsResults, list[index].testsResults)
          //assert.isObject(res.body.vacancy.company)
          assert.isObject(res.body.vacancy.city)
          assert.isArray(res.body.vacancy.openQuestions)
          assert.isArray(res.body.vacancy.testQuestions)
          assert.isArray(res.body.vacancy.testsResults)
          assert.isArray(res.body.vacancy.skills)
          assert.deepEqual(res.body.vacancy.company, list[index].company)
          assert.deepEqual(res.body.vacancy.city, list[index].city)
          assert.deepEqual(res.body.vacancy.skills, list[index].skills)
          done()
        })
    })

    it('.get count', done => count(url, path, list.length, done))

    it('.set new vacancy(company permission)', done => {
      companyUser
        .post(`${url + path}-add`)
        .send(tmpVacancy)
        .end((err, res) => {
          tmpModel = res.body.vacancy || {}
          assert.equal(res.status, 200)
          assert.property(res.body, 'vacancy')
          assert.property(res.body.vacancy, 'name')
          assert.property(res.body.vacancy, 'about')
          assert.property(res.body.vacancy, 'createdAt')
          assert.property(res.body.vacancy, 'updatedAt')
          assert.property(res.body.vacancy, 'company')
          assert.property(res.body.vacancy, 'city')
          assert.property(res.body.vacancy, 'skills')
          assert.property(res.body.vacancy, 'subscribers')
          assert.equal(res.body.vacancy.name, tmpVacancy.name)
          assert.equal(res.body.vacancy.about, tmpVacancy.about)
          done()
        })
    })

    it('.check set vacancy', done => count(url, path, list.length + 1, done))

    it('.get new vacancy', done => {
      request(url)
        .get(`${path}/${tmpModel._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'vacancy')
          assert.property(res.body.vacancy, 'name')
          assert.property(res.body.vacancy, 'about')
          assert.property(res.body.vacancy, 'createdAt')
          assert.property(res.body.vacancy, 'updatedAt')
          assert.property(res.body.vacancy, 'company')
          assert.property(res.body.vacancy, 'city')
          assert.property(res.body.vacancy, 'skills')
          assert.equal(res.body.vacancy._id, tmpModel._id)
          assert.equal(res.body.vacancy.name, tmpVacancy.name)
          assert.equal(res.body.vacancy.about, tmpVacancy.about)
          assert.isObject(res.body.vacancy.company)
          assert.isObject(res.body.vacancy.city)
          assert.isArray(res.body.vacancy.skills)
          assert.equal(res.body.vacancy.company.name.name, tmpCompany.name)
          assert.equal(res.body.vacancy.city.name, tmpVacancy.city)
          res.body.vacancy.skills.forEach(({name}) => assert.include(tmpVacancy.skills, name))
          done()
        })
    })

    it('.get list(company permission)', done => {
      companyUser
        .get(url + path)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'vacancies')
          assert.isAbove(res.body.vacancies.length, 0)
          res.body.vacancies.forEach(vacancy => {
            if (vacancy._id == tmpModel._id)
              assert.property(vacancy, 'subscribers')
            else
              assert.notProperty(vacancy, 'subscribers')
          })
          done()
        })
    })

    it('.change vacancy by id', done => {
      const index = Math.floor(list.length * Math.random())
      tmpVacancy.city = list[index].city.name
      tmpVacancy.skills = list[index].skills.map(({name}) => name)
      tmpVacancy.about = list[index].about
      tmpVacancy.name = list[index].name
      companyUser
        .put(`${url + path}-update/${tmpModel._id}`)
        .send(tmpVacancy)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'vacancy')
          assert.property(res.body.vacancy, 'name')
          assert.property(res.body.vacancy, 'about')
          assert.property(res.body.vacancy, 'createdAt')
          assert.property(res.body.vacancy, 'updatedAt')
          assert.property(res.body.vacancy, 'company')
          assert.property(res.body.vacancy, 'city')
          assert.property(res.body.vacancy, 'skills')
          assert.equal(res.body.vacancy._id, tmpModel._id)
          assert.equal(res.body.vacancy.name, tmpVacancy.name)
          assert.equal(res.body.vacancy.about, tmpVacancy.about)
          assert.isArray(res.body.vacancy.skills)
          assert.equal(res.body.vacancy.city, list[index].city._id)
          res.body.vacancy.skills.forEach(id => assert.include(list[index].skills.map(({_id}) => _id), id))
          done()
        })
    })

    it('.check change', done => {
      request(url)
        .get(`${path}/${tmpModel._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'vacancy')
          assert.property(res.body.vacancy, 'name')
          assert.property(res.body.vacancy, 'about')
          assert.property(res.body.vacancy, 'createdAt')
          assert.property(res.body.vacancy, 'updatedAt')
          assert.property(res.body.vacancy, 'company')
          assert.property(res.body.vacancy, 'city')
          assert.property(res.body.vacancy, 'skills')
          assert.equal(res.body.vacancy._id, tmpModel._id)
          assert.equal(res.body.vacancy.name, tmpVacancy.name)
          assert.equal(res.body.vacancy.about, tmpVacancy.about)
          assert.isObject(res.body.vacancy.company)
          assert.isObject(res.body.vacancy.city)
          assert.isArray(res.body.vacancy.skills)
          assert.equal(res.body.vacancy.company.name.name, tmpCompany.name)
          assert.equal(res.body.vacancy.city.name, tmpVacancy.city)
          res.body.vacancy.skills.forEach(({name}) => assert.include(tmpVacancy.skills, name))
          done()
        })
    })

    auth.login.student()

    it('.get new vacancy(student permission)', done => {
      studentUser
        .get(`${url + path}/${tmpModel._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'vacancy')
          assert.property(res.body.vacancy, 'name')
          assert.property(res.body.vacancy, 'about')
          assert.property(res.body.vacancy, 'createdAt')
          assert.property(res.body.vacancy, 'updatedAt')
          assert.property(res.body.vacancy, 'company')
          assert.property(res.body.vacancy, 'city')
          assert.property(res.body.vacancy, 'skills')
          assert.property(res.body.vacancy, 'haveSubscription')
          assert.equal(res.body.vacancy._id, tmpModel._id)
          assert.equal(res.body.vacancy.name, tmpVacancy.name)
          assert.equal(res.body.vacancy.about, tmpVacancy.about)
          assert.equal(res.body.vacancy.haveSubscription, false)
          assert.isObject(res.body.vacancy.company)
          assert.isObject(res.body.vacancy.city)
          assert.isArray(res.body.vacancy.skills)
          assert.equal(res.body.vacancy.company.name.name, tmpCompany.name)
          assert.equal(res.body.vacancy.city.name, tmpVacancy.city)
          res.body.vacancy.skills.forEach(({name}) => assert.include(tmpVacancy.skills, name))
          assert.notProperty(res.body.vacancy, 'subscribers')
          done()
        })
    })

    xit('.subscribe to new vacancy', done => {
      studentUser
        .get(`${url + path}-subscribe/${tmpModel._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'vacancy')
          assert.property(res.body.vacancy, 'name')
          assert.property(res.body.vacancy, 'about')
          assert.property(res.body.vacancy, 'createdAt')
          assert.property(res.body.vacancy, 'updatedAt')
          assert.property(res.body.vacancy, 'company')
          assert.property(res.body.vacancy, 'city')
          assert.property(res.body.vacancy, 'skills')
          assert.property(res.body.vacancy, 'haveSubscription')
          assert.equal(res.body.vacancy._id, tmpModel._id)
          assert.equal(res.body.vacancy.name, tmpVacancy.name)
          assert.equal(res.body.vacancy.about, tmpVacancy.about)
          assert.equal(res.body.vacancy.haveSubscription, true)
          assert.isObject(res.body.vacancy.company)
          assert.isObject(res.body.vacancy.city)
          assert.isArray(res.body.vacancy.skills)
          assert.equal(res.body.vacancy.company.name.name, tmpCompany.name)
          assert.equal(res.body.vacancy.city.name, tmpVacancy.city)
          res.body.vacancy.skills.forEach(({name}) => assert.include(tmpVacancy.skills, name))
          assert.notProperty(res.body.vacancy, 'subscribers')
          done()
        })
    })

    xit('.unsubscribe from new vacancy', done => {
      studentUser
        .get(`${url + path}-unsubscribe/${tmpModel._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'vacancy')
          assert.property(res.body.vacancy, 'name')
          assert.property(res.body.vacancy, 'about')
          assert.property(res.body.vacancy, 'createdAt')
          assert.property(res.body.vacancy, 'updatedAt')
          assert.property(res.body.vacancy, 'company')
          assert.property(res.body.vacancy, 'city')
          assert.property(res.body.vacancy, 'skills')
          assert.property(res.body.vacancy, 'haveSubscription')
          assert.equal(res.body.vacancy._id, tmpModel._id)
          assert.equal(res.body.vacancy.name, tmpVacancy.name)
          assert.equal(res.body.vacancy.about, tmpVacancy.about)
          assert.equal(res.body.vacancy.haveSubscription, false)
          assert.isObject(res.body.vacancy.company)
          assert.isObject(res.body.vacancy.city)
          assert.isArray(res.body.vacancy.skills)
          assert.equal(res.body.vacancy.company.name.name, tmpCompany.name)
          assert.equal(res.body.vacancy.city.name, tmpVacancy.city)
          res.body.vacancy.skills.forEach(({name}) => assert.include(tmpVacancy.skills, name))
          assert.notProperty(res.body.vacancy, 'subscribers')
          done()
        })
    })
    
    auth.logout.student()

    auth.logout.company()

    it('.delete item', done => deleteItem(url, `${path}/${tmpModel._id}`, done))

    it('.check get delete', done => count(url, path, list.length, done))

    it('.search by city', done => {
      const city = list[Math.floor(list.length * Math.random())].city.name
      request(url)
        .post(`${path}-search`)
        .send({city})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'vacancies')
          assert.isAbove(res.body.vacancies.length, 0);
          res.body.vacancies.forEach((item) => assert.equal(item.city.name, city))
          done()
        })
    })

    it('.search by name', done => {
      const name = list[Math.floor(list.length * Math.random())].name
      request(url)
        .post(`${path}-search`)
        .send({name})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'vacancies')
          assert.isAbove(res.body.vacancies.length, 0)
          res.body.vacancies.forEach((item) => {
            assert.property(item, 'name')
            assert.equal(item.name, name)
          })
          done()
        })
    })
  })

  describe('vacancy question & answers tests', () => {

    it('.get random open questions', done => {
      request(url)
        .get('/api/open-question')
        .end((err, res) =>  {
          list = res.body.openQuestions || []
          index = Math.floor(list.length * Math.random())
          openQuestion1 = list[index]
          index = Math.floor(list.length * Math.random())
          openQuestion2 = list[index]
          done()
        })
    })

    it('.get random test questions', done => {
      request(url)
        .get('/api/test-question')
        .end((err, res) =>  {
          list = res.body.testQuestions || []
          index = Math.floor(list.length * Math.random())
          testQuestion1 = list[index]
          index = Math.floor(list.length * Math.random())
          testQuestion2 = list[index]
          done()
        })
    })

    it('.create new vacancy unauthorized', done => {
      request(url)
        .post(`${path}-add`)
        .send(tmpVacancy)
        .end((err, res) => {
          assert.equal(res.status, 401)
          done()
        })
    })

    auth.login.student()
    auth.login.company()

    it('.create new vacancy as student', done => {
      studentUser
        .post(`${url + path}-add`)
        .send(tmpVacancy)
        .end((err, res) => {
          assert.equal(res.status, 401)
          done()
        })
    })

    it('.create new vacancy as company', done => {
      companyUser
        .post(`${url + path}-add`)
        .send(tmpVacancy)
        .end((err, res) => {
          assert.equal(res.status, 200)
          tmpModel = res.body.vacancy || {}
          done()
        })
    })

    it('.add test and open questions', done => {
      tmpVacancy.openQuestions = [openQuestion1, openQuestion2]
      tmpVacancy.testQuestions = [testQuestion1, testQuestion2]
      companyUser
        .put(`${url + path}-update/${tmpModel._id}`)
        .send(tmpVacancy)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'vacancy')
          assert.property(res.body.vacancy, 'name')
          assert.property(res.body.vacancy, 'about')
          assert.property(res.body.vacancy, 'createdAt')
          assert.property(res.body.vacancy, 'updatedAt')
          assert.property(res.body.vacancy, 'company')
          assert.property(res.body.vacancy, 'city')
          assert.property(res.body.vacancy, 'skills')
          assert.property(res.body.vacancy, 'openQuestions')
          assert.property(res.body.vacancy, 'testQuestions')
          assert.equal(res.body.vacancy._id, tmpModel._id)
          assert.equal(res.body.vacancy.name, tmpVacancy.name)
          assert.equal(res.body.vacancy.about, tmpVacancy.about)
          assert.equal(res.body.vacancy.openQuestions.length, 2)
          assert.equal(res.body.vacancy.testQuestions.length, 2)
          assert.equal(res.body.vacancy.openQuestions[0], openQuestion1._id)
          assert.equal(res.body.vacancy.openQuestions[1], openQuestion2._id)
          assert.equal(res.body.vacancy.testQuestions[0], testQuestion1._id)
          assert.equal(res.body.vacancy.testQuestions[1], testQuestion2._id)
          done()
        })
    })

    it('.check student is have not subscribe', done => {
      studentUser
        .get(`${url + path}/${tmpModel._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isNotOk(res.body.vacancy.haveSubscription)
          done()
        })
    })

    it('.subscribe and pass tests on vacancy', done => {
      tmpVacancy.testsResults = {}
      tmpVacancy.testsResults.testAnswers = [testQuestion1.correct, testQuestion2.correct]
      tmpVacancy.testsResults.openAnswers = [openQuestion1.answer, openQuestion2.answer]
      studentUser
        .post(`${url + path}-subscribe/${tmpModel._id}`)
        .send(tmpVacancy)
        .end((err, res) => {
          console.log(res.body, res.status)
          assert.equal(res.status, 200)
          assert.property(res.body.vacancy, 'testsResults')
          assert.isArray(res.body.vacancy.testsResults)
          assert.property(res.body.vacancy.testsResults[0], 'testAnswers')
          assert.property(res.body.vacancy.testsResults[0], 'openAnswers')
          assert.property(res.body.vacancy.testsResults[0], 'student')
          assert.property(res.body.vacancy.testsResults[0], 'correct')
          assert.deepEqual(res.body.vacancy.testsResults[0].testAnswers, tmpVacancy.testsResults.testAnswers)
          assert.deepEqual(res.body.vacancy.testsResults[0].openAnswers, tmpVacancy.testsResults.openAnswers)
          assert.equal(res.body.vacancy.testsResults[0].student, tmpStudentId)
          assert.equal(res.body.vacancy.testsResults[0].correct, 4)

          done()
        })
    })

    it('.check student is have subscribe', done => {
      studentUser
        .get(`${url + path}/${tmpModel._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isOk(res.body.vacancy.haveSubscription)
          done()
        })
    })

    it('.check subscribe user', done => {
      companyUser
        .get(`${url + path}/${tmpModel._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.vacancy.testsResults.length, 1)
          done()
        })
    })

    auth.logout.company()
    auth.logout.student()

    it('.delete student', done => deleteItem(url, `/api/student/${tmpStudentId}`, done))
    it('.delete company', done => deleteItem(url, `/api/company/${tmpStudentId}`, done))
    it('.delete vacancy', done => deleteItem(url, `/api/vacancy/${tmpModel._id}`, done))
  })

}
