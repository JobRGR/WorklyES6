import {assert} from 'chai'
import request from 'supertest'
import count from '../helpers/count'
import deleteItem from '../helpers/delete'
import Company from '../../../src/server/models/company'
import async from '../../../node_modules/async'
import superagent from 'superagent'
let agent = superagent.agent()

export default (url) => {
  let tmpCompany = {name: 'InsSolutions', password: '1111', email: 'ins_solutins@somnia.com'}
  let tmpModel = null
  let companyId = null
  let tmpCompanyModel = null

  describe('all question"s tests', function() {

    before(done => {
      request(url)
        .post('/api/company')
        .send(tmpCompany)
        .end((err, res) => {
          tmpCompanyModel = res.body.company || {}
          done()
        })
    })

    after(done => deleteItem(url, `/api/company/${tmpCompanyModel._id}`, done))

    let getSession = done => {
      let req = request(url)
        .get(`/api/company-status`)
      agent.attachCookies(req)

      req.end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'company')
        assert.property(res.body.company, 'name')
        assert.equal(res.body.company.name.name, tmpCompany.name)
        assert.equal(res.body.company.email, tmpCompany.email)
        assert.notProperty(res.body.company, 'salt')
        assert.notProperty(res.body.company, 'hashedPassword')
        done()
      })
    }

    let checkLogin = () => {
      it('.login company', done => {
        request(url)
          .post(`/api/company-login`)
          .send(tmpCompany)
          .end((err, res) => {
            agent.saveCookies(res)
            companyId = res.body.company._id
            assert.equal(res.status, 200)
            assert.property(res.body, 'company')
            assert.property(res.body.company, 'name')
            assert.equal(res.body.company.name.name, tmpCompany.name)
            assert.equal(res.body.company.email, tmpCompany.email)
            assert.notProperty(res.body.company, 'salt')
            assert.notProperty(res.body.company, 'hashedPassword')
            done()
          })
      })

      it('.get session login company', getSession)
    }

    checkLogin()

    it('.add first open questions for company', done => {
      let req = request(url).post("/api/open-question-add")

      let tmpData = {
        question: "abc",
        answer: "abc",
        free: true
      }

      agent.attachCookies(req)
      req
        .send(tmpData)
        .end(((err, res) => {
          tmpModel = res.body.openQuestion || {}
          assert.equal(res.status, 200)
          assert.property(res.body, 'openQuestion')
          assert.deepEqual(res.body.openQuestion, tmpModel)
          done()
        }))

    })

    it('.add second open questions for company', done => {
      let req = request(url).post("/api/open-question-add")

      let tmpData = {
        question: "123",
        answer: "123",
        free: false
      }

      agent.attachCookies(req)
      req
        .send(tmpData)
        .end(((err, res) => {
          tmpModel = res.body.openQuestion || {}
          assert.equal(res.status, 200)
          assert.property(res.body, 'openQuestion')
          assert.deepEqual(res.body.openQuestion, tmpModel)
          done()
        }))

    })

    it('.add first test questions for company', done => {

      let tmpData = {
        question: "qwer",
        answer: ["qwer","43","json"],
        correct: 2,
        free: true
      }

      let req = request(url).post("/api/test-question-add")
      agent.attachCookies(req)
      req
        .send(tmpData)
        .end(((err, res) => {
          tmpModel = res.body.testQuestion || {}
          assert.equal(res.status, 200)
          assert.property(res.body, 'testQuestion')
          assert.deepEqual(res.body.testQuestion, tmpModel)
          done()
        }))

    })

    it('.add second test questions for company', done => {
      let req = request(url).post("/api/test-question-add")

      let tmpData = {
        question: "qaz",
        answer: ["qaz","wsx","edc"],
        correct: 1,
        free: false
      }

      agent.attachCookies(req)
      req
        .send(tmpData)
        .end(((err, res) => {
          tmpModel = res.body.testQuestion || {}
          assert.equal(res.status, 200)
          assert.property(res.body, 'testQuestion')
          assert.deepEqual(res.body.testQuestion, tmpModel)
          done()
        }))
    })

    it('.get all my questions', done => {
      let req = request(url).get("/api/all-question-my")
      agent.attachCookies(req)
      req
        .end(((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'openQuestions')
          assert.property(res.body, 'testQuestions')
          res.body.openQuestions.forEach((el) => assert.equal(el.owner._id, companyId))
          res.body.testQuestions.forEach((el) => assert.equal(el.owner._id, companyId))
          done()
        }))

    })

    it('.get all questions by company id', done => {
      let req = request(url).get("/api/all-question/" + companyId)
      agent.attachCookies(req)
      req
        .end(((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'openQuestions')
          assert.property(res.body, 'testQuestions')
          res.body.openQuestions.forEach((el) => {
            assert.equal(el.owner._id, companyId)
            assert.equal(el.free, true)
          })
          res.body.testQuestions.forEach((el) => {
            assert.equal(el.owner._id, companyId)
            assert.equal(el.free, true)
          })
          done()
        }))
    })

  })
}