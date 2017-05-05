import {assert} from 'chai'
import request from 'supertest'
import count from '../helpers/count'
import deleteItem from '../helpers/delete'
import Company from '../../../src/server/models/company'
import async from '../../../node_modules/async'
import superagent from 'superagent'
let agent = superagent.agent()

export default (url) => {
    const path = '/api/test-question'

    let tmpData = {
        question: "Which came first, the chicken or the egg?",
        answer: ["the chicken egg came first because the genetic recombination that produced the first 'chicken'occurred in germ-line cells in a non-chicken ancestor","43","json"],
        correct: 0,
        free: true
    }

    let newTmpData = {
        question: "Can God create a stone so heavy that it cannot lift it?",
        answer: ["No","Yes"],
        correct: 1,
        free: false
    }

    let tmpCompany = {name: 'InsSolutions', password: '1111', email: 'ins_solutins@somnia.com'}
    let tmpModel = null
    let list = null
    let tmpCompanyModel = null
    let curCount = null

    describe('test questions tests', () => {
        before(done => {
            request(url)
              .post('/api/company')
              .send(tmpCompany)
              .end((err, res) => {
                  tmpCompanyModel = res.body.company || {}
                request(url)
                  .get(`${path}-count`)
                  .end((err, res) => {
                    curCount = res.body.count
                    done()
                  })
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
        }

        it('.get list', done => {
            request(url)
              .get(path)
              .end((err, res) => {
                  list = res.body.testQuestions || []
                  assert.equal(res.status, 200)
                  assert.property(res.body, 'testQuestions')
                  assert.isAbove(res.body.testQuestions.length, 0)
                  done()
              })
        })

        it('.get random item', done => {
            const index = Math.floor(list.length * Math.random())
            request(url)
              .get(`${path}/${list[index]._id}`)
              .end((err, res) => {
                  assert.equal(res.status, 200)
                  assert.property(res.body, 'testQuestion')
                  assert.property(res.body.testQuestion, 'question')
                  assert.property(res.body.testQuestion, 'answer')
                  assert.property(res.body.testQuestion, 'correct')
                  assert.property(res.body.testQuestion, 'free')
                  assert.property(res.body.testQuestion, 'owner')
                  assert.equal(res.body.testQuestion.question, list[index].question)
                  assert.deepEqual(res.body.testQuestion.answer, list[index].answer)
                  assert.equal(res.body.testQuestion.free, list[index].free)
                  assert.equal(res.body.testQuestion.correct, list[index].correct)
                  assert.equal(res.body.testQuestion._id, list[index]._id)
                  assert.deepEqual(res.body.testQuestion.owner, list[index].owner)
                  assert.isString(res.body.testQuestion.question)
                  //assert.isObject(res.body.testQuestion.owner)
                  assert.isArray(res.body.testQuestion.answer)
                  assert.isBoolean(res.body.testQuestion.free)
                  assert.isNumber(res.body.testQuestion.correct)
                  done()
              })
        })

        it('.get count', done => count(url, path, curCount, done))

        it('.set item', done => {
          let index = null
            do {
              index = Math.floor(list.length * Math.random())
            } while (!list[index].owner)
            tmpData.owner = list[index].owner._id
            request(url)
              .post(path)
              .send(tmpData)
              .end(((err, res) => {
                  tmpModel = res.body.testQuestion || {}
                  assert.equal(res.status, 200)
                  assert.property(res.body, 'testQuestion')
                  assert.property(res.body.testQuestion, 'question')
                  assert.property(res.body.testQuestion, 'answer')
                  assert.property(res.body.testQuestion, 'free')
                  assert.property(res.body.testQuestion, 'correct')
                  assert.equal(res.body.testQuestion.question, tmpData.question)
                  assert.deepEqual(res.body.testQuestion.answer, tmpData.answer)
                  assert.equal(res.body.testQuestion.free, tmpData.free)
                  assert.equal(res.body.testQuestion.correct, tmpData.correct)
                  done()
              }))
        })

        it('.check set', done => count(url, path, curCount + 1, done))

        it('.put item', done => {
            let index = null
            do {
              index = Math.floor(list.length * Math.random())
            } while (!list[index].owner)
            newTmpData.owner = list[index].owner._id
            request(url)
              .put(`${path}/${tmpModel._id}`)
              .send(newTmpData)
              .end((err, res) => {
                  assert.equal(res.status, 200)
                  assert.property(res.body, 'testQuestion')
                  assert.property(res.body.testQuestion, 'question')
                  assert.property(res.body.testQuestion, 'answer')
                  assert.property(res.body.testQuestion, 'free')
                  assert.property(res.body.testQuestion, 'correct')
                  assert.property(res.body.testQuestion, 'owner')
                  assert.equal(res.body.testQuestion.question, newTmpData.question)
                  assert.deepEqual(res.body.testQuestion.answer, newTmpData.answer)
                  assert.equal(res.body.testQuestion.free, newTmpData.free)
                  assert.equal(res.body.testQuestion.correct, newTmpData.correct)
                  assert.equal(res.body.testQuestion.owner, newTmpData.owner)
                  done()
              })
        })

        it('.check put item', done => {
            request(url)
              .get(`${path}/${tmpModel._id}`)
              .end((err, res) => {
                  assert.equal(res.status, 200)
                  assert.property(res.body, 'testQuestion')
                  assert.property(res.body.testQuestion, 'question')
                  assert.property(res.body.testQuestion, 'answer')
                  assert.property(res.body.testQuestion, 'free')
                  assert.property(res.body.testQuestion, 'correct')
                  assert.property(res.body.testQuestion, 'owner')
                  assert.equal(res.body.testQuestion.question, newTmpData.question)
                  assert.deepEqual(res.body.testQuestion.answer, newTmpData.answer)
                  assert.equal(res.body.testQuestion.free, newTmpData.free)
                  assert.equal(res.body.testQuestion.correct, newTmpData.correct)
                  assert.equal(res.body.testQuestion.owner._id, newTmpData.owner)
                  assert.isObject(res.body.testQuestion.owner)
                  done()
              })
        })

        it('.delete item', done => deleteItem(url, `${path}/${tmpModel._id}`, done))

        it('.check get delete', done => count(url, path, curCount, done))

        it('.random', done => {
            request(url)
              .get(`${path}-random`)
              .end((err, res) => {
                  assert.equal(res.status, 200)
                  assert.property(res.body, 'testQuestion')
                  assert.property(res.body.testQuestion, 'question')
                  assert.property(res.body.testQuestion, 'answer')
                  assert.property(res.body.testQuestion, 'free')
                  assert.property(res.body.testQuestion, 'correct')
                  assert.property(res.body.testQuestion, 'owner')
                  assert.isString(res.body.testQuestion.question)
                  assert.isArray(res.body.testQuestion.answer)
                  assert.isBoolean(res.body.testQuestion.free)
                  assert.isNumber(res.body.testQuestion.correct)
                  //assert.isObject(res.body.testQuestion.owner)
                  done()
              })
        })

        it('.get questions by companys name', done => {
            const data = {companyName: 'Abweb'}
            request(url)
              .post(`/api/test-question-company`)
              .send(data)
              .end((err, res) => {
                  assert.equal(res.status, 200)
                  assert.property(res.body, 'testQuestions')
                  assert.isArray(res.body.testQuestions)
                  for (var i = 0; i<res.body.testQuestions; ++i)
                      assert.equal(res.body.testQuestions[i].free, true)
                  done()
              })
        })

        it('.get questions by companys id', done => {
          let index = null
          do {
            index = Math.floor(list.length * Math.random())
          } while (!list[index].owner)
          const searchId = list[index].owner._id
          const searchedById = []
          list.forEach(el => el.owner && el.owner._id == searchId && el.free && searchedById.push(el))

          request(url)
            .get(`/api/test-question-company/${searchId}`)
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, 'testQuestions')
                assert.isArray(res.body.testQuestions)
                assert.deepEqual(res.body.testQuestions, searchedById)
                done()
            })
        })

        it('.get my test questions', done => {
            request(url)
              .get(`/api/test-question-my`)
              .end((err, res) => {
                  assert.equal(res.status, 401)
                  assert.property(res.body, 'message')
                  assert.property(res.body, 'err')
                  assert.isObject(res.body.err)
                  assert.equal(res.body.message, 'Unauthorized')
                  done()
              })
        })

        checkLogin()

        it('.add questions for company', done => {
            let req = request(url).post("/api/test-question-add")
            agent.attachCookies(req)
            req
              .send(tmpData)
              .end(((err, res) => {
                  tmpModel = res.body.testQuestion || {}
                  assert.equal(res.status, 200)
                  assert.property(res.body, 'testQuestion')
                  assert.deepEqual(res.body.testQuestion, tmpModel)
              }))
            done()
        })

        it('.get my test questions', done => {
            let req = request(url).get(`/api/test-question-my`)
            agent.attachCookies(req)

            req.end((err, res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, 'testQuestions')
                assert.isArray(res.body.testQuestions)
                assert.property(res.body.testQuestions[0], '_id')
                assert.property(res.body.testQuestions[0], 'answer')
                assert.property(res.body.testQuestions[0], 'free')
                assert.property(res.body.testQuestions[0], 'owner')
                assert.property(res.body.testQuestions[0], 'question')
                assert.property(res.body.testQuestions[0], 'correct')
                assert.equal(res.body.testQuestions[0]._id, tmpModel._id)
                assert.deepEqual(res.body.testQuestions[0].answer, tmpModel.answer)
                assert.equal(res.body.testQuestions[0].free, tmpModel.free)
                assert.equal(res.body.testQuestions[0].owner._id, tmpModel.owner)
                assert.equal(res.body.testQuestions[0].correct, tmpModel.correct)
                assert.equal(res.body.testQuestions[0].question, tmpModel.question)
                done()
            })
        })

        it('.delete added question', done => deleteItem(url, `/api/test-question/${tmpModel._id}`, done))
    })
}