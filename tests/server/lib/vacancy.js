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
    list = []

  describe('vacancy tests', () => {

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
          assert.property(res.body.vacancy, 'companyName')
          assert.property(res.body.vacancy, 'city')
          assert.property(res.body.vacancy, 'skills')
          assert.equal(res.body.vacancy.name, list[index].name)
          assert.equal(res.body.vacancy.about, list[index].about)
          assert.equal(res.body.vacancy._id, list[index]._id)
          assert.isObject(res.body.vacancy.companyName)
          assert.isObject(res.body.vacancy.city)
          assert.isArray(res.body.vacancy.skills)
          assert.deepEqual(res.body.vacancy.companyName, list[index].companyName)
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
          assert.property(res.body.vacancy, 'companyName')
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
          assert.property(res.body.vacancy, 'companyName')
          assert.property(res.body.vacancy, 'city')
          assert.property(res.body.vacancy, 'skills')
          assert.equal(res.body.vacancy._id, tmpModel._id)
          assert.equal(res.body.vacancy.name, tmpVacancy.name)
          assert.equal(res.body.vacancy.about, tmpVacancy.about)
          assert.isObject(res.body.vacancy.companyName)
          assert.isObject(res.body.vacancy.city)
          assert.isArray(res.body.vacancy.skills)
          assert.equal(res.body.vacancy.companyName.name, tmpCompany.name)
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
          assert.property(res.body.vacancy, 'companyName')
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
          assert.property(res.body.vacancy, 'companyName')
          assert.property(res.body.vacancy, 'city')
          assert.property(res.body.vacancy, 'skills')
          assert.equal(res.body.vacancy._id, tmpModel._id)
          assert.equal(res.body.vacancy.name, tmpVacancy.name)
          assert.equal(res.body.vacancy.about, tmpVacancy.about)
          assert.isObject(res.body.vacancy.companyName)
          assert.isObject(res.body.vacancy.city)
          assert.isArray(res.body.vacancy.skills)
          assert.equal(res.body.vacancy.companyName.name, tmpCompany.name)
          assert.equal(res.body.vacancy.city.name, tmpVacancy.city)
          res.body.vacancy.skills.forEach(({name}) => assert.include(tmpVacancy.skills, name))
          done()
        })
    })

    auth.logout.company()

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
          assert.property(res.body.vacancy, 'companyName')
          assert.property(res.body.vacancy, 'city')
          assert.property(res.body.vacancy, 'skills')
          assert.property(res.body.vacancy, 'haveSubscription')
          assert.equal(res.body.vacancy._id, tmpModel._id)
          assert.equal(res.body.vacancy.name, tmpVacancy.name)
          assert.equal(res.body.vacancy.about, tmpVacancy.about)
          assert.equal(res.body.vacancy.haveSubscription, false)
          assert.isObject(res.body.vacancy.companyName)
          assert.isObject(res.body.vacancy.city)
          assert.isArray(res.body.vacancy.skills)
          assert.equal(res.body.vacancy.companyName.name, tmpCompany.name)
          assert.equal(res.body.vacancy.city.name, tmpVacancy.city)
          res.body.vacancy.skills.forEach(({name}) => assert.include(tmpVacancy.skills, name))
          assert.notProperty(res.body.vacancy, 'subscribers')
          done()
        })
    })

    it('.subscribe to new vacancy', done => {
      studentUser
        .get(`${url + path}-subscribe/${tmpModel._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'vacancy')
          assert.property(res.body.vacancy, 'name')
          assert.property(res.body.vacancy, 'about')
          assert.property(res.body.vacancy, 'createdAt')
          assert.property(res.body.vacancy, 'updatedAt')
          assert.property(res.body.vacancy, 'companyName')
          assert.property(res.body.vacancy, 'city')
          assert.property(res.body.vacancy, 'skills')
          assert.property(res.body.vacancy, 'haveSubscription')
          assert.equal(res.body.vacancy._id, tmpModel._id)
          assert.equal(res.body.vacancy.name, tmpVacancy.name)
          assert.equal(res.body.vacancy.about, tmpVacancy.about)
          assert.equal(res.body.vacancy.haveSubscription, true)
          assert.isObject(res.body.vacancy.companyName)
          assert.isObject(res.body.vacancy.city)
          assert.isArray(res.body.vacancy.skills)
          assert.equal(res.body.vacancy.companyName.name, tmpCompany.name)
          assert.equal(res.body.vacancy.city.name, tmpVacancy.city)
          res.body.vacancy.skills.forEach(({name}) => assert.include(tmpVacancy.skills, name))
          assert.notProperty(res.body.vacancy, 'subscribers')
          done()
        })
    })

    it('.unsubscribe from new vacancy', done => {
      studentUser
        .get(`${url + path}-unsubscribe/${tmpModel._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'vacancy')
          assert.property(res.body.vacancy, 'name')
          assert.property(res.body.vacancy, 'about')
          assert.property(res.body.vacancy, 'createdAt')
          assert.property(res.body.vacancy, 'updatedAt')
          assert.property(res.body.vacancy, 'companyName')
          assert.property(res.body.vacancy, 'city')
          assert.property(res.body.vacancy, 'skills')
          assert.property(res.body.vacancy, 'haveSubscription')
          assert.equal(res.body.vacancy._id, tmpModel._id)
          assert.equal(res.body.vacancy.name, tmpVacancy.name)
          assert.equal(res.body.vacancy.about, tmpVacancy.about)
          assert.equal(res.body.vacancy.haveSubscription, false)
          assert.isObject(res.body.vacancy.companyName)
          assert.isObject(res.body.vacancy.city)
          assert.isArray(res.body.vacancy.skills)
          assert.equal(res.body.vacancy.companyName.name, tmpCompany.name)
          assert.equal(res.body.vacancy.city.name, tmpVacancy.city)
          res.body.vacancy.skills.forEach(({name}) => assert.include(tmpVacancy.skills, name))
          assert.notProperty(res.body.vacancy, 'subscribers')
          done()
        })
    })

    auth.logout.student()

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
}
