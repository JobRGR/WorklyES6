import {assert} from 'chai'
import request from 'supertest'
import count from '../helpers/count'
import deleteItem from '../helpers/delete'
import superagent from 'superagent'
let agent = superagent.agent()

export default (url) => {
  const path = '/api/vacancy'
  let list = []
  let tmpCompany = {name: 'InsSolutions', password: '1111', email: 'ins_solutins@somnia.com'}
  let tmpVacancy = {name: 'Web Full Stack', about: 'some description', city: 'Київ', skills: ['Web', 'JavaScript']}
  let tmpModel = null
  let tmpCompanyId = null

  describe('vacancy tests', () => {

    let loginCompany = () => {
      it('.set company/save cookies', done => {
        request(url)
          .post(`/api/company`)
          .send(tmpCompany)
          .end((err, res) => {
            agent.saveCookies(res)
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
    }

    let deleteCompany = () => {
      it('.delete company/reset cookies', done => {
        request(url)
          .delete(`/api/company/${tmpCompanyId}`)
          .send(tmpCompany)
          .end((err, res) => {
            assert.equal(res.status, 200)
            done()
          })
      })
    }

    loginCompany()

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
      let req = request(url).post(`${path}-add`)
      agent.attachCookies(req)
      req.send(tmpVacancy)
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
      let req = request(url).get(path)
      agent.attachCookies(req)
      req
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
      let req = request(url).put(`${path}-update/${tmpModel._id}`)
      agent.attachCookies(req)
      req
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

    it('.delete item', done => deleteItem(url, `${path}/${tmpModel._id}`, done))

    it('.check get delete', done => count(url, path, list.length, done))

    deleteCompany()

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
