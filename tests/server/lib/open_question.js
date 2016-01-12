import {assert} from 'chai'
import request from 'supertest'
import count from '../helpers/count'
import deleteItem from '../helpers/delete'
import Company from '../../../src/server/models/company'
import async from '../../../node_modules/async'
import superagent from 'superagent'
let agent = superagent.agent()

export default (url) => {
    const path = '/api/open-question'

    let tmpData = {
        question: "Which came first, the chicken or the egg?",
        answer: "the chicken egg came first because the genetic recombination that produced the first 'chicken'occurred in germ-line cells in a non-chicken ancestor",
        free: true
    }

    let newTmpData = {
        question: "Can God create a stone so heavy that it cannot lift it?",
        answer: "No",
        free: false
    }

    let tmpCompany = {name: 'InsSolutions', password: '1111', email: 'ins_solutins@somnia.com'}
    let tmpModel = null
    let tmpCompanyModel = null
    let list = null
    let companyId = null

    describe('open question"s tests', function() {
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

        it('.get list', done => {
            request(url)
                .get(path)
                .end((err, res) =>  {
                    list = res.body.openQuestions || []
                    assert.equal(res.status, 200)
                    assert.property(res.body, 'openQuestions')
                    assert.isAbove(res.body.openQuestions.length, 0)
                    done()
                })
        })

        it('.get random item', done => {
            const index = Math.floor(list.length * Math.random())
            request(url)
                .get(`${path}/${list[index]._id}`)
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.property(res.body, 'openQuestion')
                    assert.property(res.body.openQuestion, 'question')
                    assert.property(res.body.openQuestion, 'answer')
                    assert.property(res.body.openQuestion, 'free')
                    assert.property(res.body.openQuestion, 'owner')
                    assert.equal(res.body.openQuestion.question, list[index].question)
                    assert.equal(res.body.openQuestion.answer, list[index].answer)
                    assert.equal(res.body.openQuestion.free, list[index].free)
                    assert.equal(res.body.openQuestion._id, list[index]._id)
                    assert.deepEqual(res.body.openQuestion.owner, list[index].owner)
                    assert.isObject(res.body.openQuestion.owner)
                    assert.isString(res.body.openQuestion.question)
                    assert.isString(res.body.openQuestion.answer)
                    assert.isBoolean(res.body.openQuestion.free)
                    done()
                })
        })

        it('.get count', done => count(url, path, list.length, done))

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
                    tmpModel = res.body.openQuestion || {}
                    assert.equal(res.status, 200)
                    assert.property(res.body, 'openQuestion')
                    assert.property(res.body.openQuestion, 'question')
                    assert.property(res.body.openQuestion, 'answer')
                    assert.property(res.body.openQuestion, 'free')
                    assert.property(res.body.openQuestion, 'owner')
                    assert.equal(res.body.openQuestion.owner, tmpData.owner)
                    assert.equal(res.body.openQuestion.question, tmpData.question)
                    assert.equal(res.body.openQuestion.answer, tmpData.answer)
                    assert.equal(res.body.openQuestion.free, tmpData.free)
                    done()
                }))
        })

        it('.check set', done => count(url, path, list.length + 1, done))

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
                    assert.property(res.body, 'openQuestion')
                    assert.property(res.body.openQuestion, 'question')
                    assert.property(res.body.openQuestion, 'answer')
                    assert.property(res.body.openQuestion, 'free')
                    assert.property(res.body.openQuestion, 'owner')
                    assert.equal(res.body.openQuestion.question, newTmpData.question)
                    assert.equal(res.body.openQuestion.answer, newTmpData.answer)
                    assert.equal(res.body.openQuestion.free, newTmpData.free)
                    assert.equal(res.body.openQuestion.owner, newTmpData.owner)
                    done()
                })
        })

        it('.check put item', done => {
            request(url)
                .get(`${path}/${tmpModel._id}`)
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.property(res.body, 'openQuestion')
                    assert.property(res.body.openQuestion, 'question')
                    assert.property(res.body.openQuestion, 'answer')
                    assert.property(res.body.openQuestion, 'free')
                    assert.property(res.body.openQuestion, 'owner')
                    assert.equal(res.body.openQuestion.question, newTmpData.question)
                    assert.equal(res.body.openQuestion.answer, newTmpData.answer)
                    assert.equal(res.body.openQuestion.free, newTmpData.free)
                    assert.equal(res.body.openQuestion.owner._id, newTmpData.owner)
                    assert.isObject(res.body.openQuestion.owner)

                    done()
                })
        })

        it('.delete item', done => deleteItem(url, `${path}/${tmpModel._id}`, done))

        it('.check get delete', done => count(url, path, list.length, done))

        it('.random', done => {
            request(url)
                .get(`${path}-random`)
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.property(res.body, 'openQuestion')
                    assert.property(res.body.openQuestion, 'question')
                    assert.property(res.body.openQuestion, 'answer')
                    assert.property(res.body.openQuestion, 'free')
                    assert.property(res.body.openQuestion, 'owner')
                    assert.isString(res.body.openQuestion.question)
                    assert.isString(res.body.openQuestion.answer)
                    assert.isBoolean(res.body.openQuestion.free)
                    assert.isObject(res.body.openQuestion.owner)
                    done()
                })
        })

        it('.get questions by companys name', done => {
            const data = {companyName: 'Abweb'}
            request(url)
                .post(`/api/open-question-company`)
                .send(data)
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.property(res.body, 'openQuestions')
                    assert.isArray(res.body.openQuestions)
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
            const searchedById  = []
            list.forEach(el => el.owner && el.owner._id == searchId && el.free && searchedById.push(el))

            request(url)
                .get(`/api/open-question-company/${searchId}`)
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.property(res.body, 'openQuestions')
                    assert.isArray(res.body.openQuestions)
                    assert.deepEqual(res.body.openQuestions, searchedById)
                    done()
                })
        })

        it('.get my open questions', done => {
            request(url)
                .get(`/api/open-question-my`)
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
        let req = request(url).post("/api/open-question-add")
        agent.attachCookies(req)
        tmpModel = {}
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

    it('.get my open questions', done => {
      let req = request(url).get(`/api/open-question-my`)
      agent.attachCookies(req)

      req.end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'openQuestions')
        assert.isArray(res.body.openQuestions)
        assert.property(res.body.openQuestions[0], '_id')
        assert.property(res.body.openQuestions[0], 'answer')
        assert.property(res.body.openQuestions[0], 'free')
        assert.property(res.body.openQuestions[0], 'owner')
        assert.property(res.body.openQuestions[0], 'question')
        assert.equal(res.body.openQuestions[0]._id, tmpModel._id)
        assert.equal(res.body.openQuestions[0].answer, tmpModel.answer)
        assert.equal(res.body.openQuestions[0].free, tmpModel.free)
        assert.equal(res.body.openQuestions[0].owner._id, tmpModel.owner)
        assert.equal(res.body.openQuestions[0].question, tmpModel.question)
        done()
      })
    })


      it('.delete added question', done => deleteItem(url, `/api/open-question/${tmpModel._id}`, done))

    })
}