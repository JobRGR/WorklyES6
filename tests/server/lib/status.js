import {assert} from 'chai'
import request from 'supertest'
import count from '../helpers/count'
import deleteItem from '../helpers/delete'
import superagent from 'superagent'
let agent = superagent.agent()

export default (url) => {
  const path = '/api'

  let tmpStudent = {name: 'Alex Loud', password: '1111', email: 'alex@gmail.com'}
  let tmpCompany = {name: 'InsSolutions', password: '1111', email: 'ins_solutins@somnia.com'}
  let tmpModelStudent = null
  let tmpModelCompany = null

  describe('login tests', () => {
    before(done =>
      request(url)
        .post(`${path}/student`)
        .send(tmpStudent)
        .end((err, res) => {
          tmpModelStudent = res.body.student || {}
          request(url)
            .post(`${path}/company`)
            .send(tmpCompany)
            .end((err, res) => {
              tmpModelCompany = res.body.company || {}
              done()
            })
        }))

    after(done => deleteItem(url, `${path}/student/${tmpModelStudent._id}`,
      () =>  deleteItem(url, `${path}/company/${tmpModelCompany._id}`, done)))


    it('.login student with not correct password', done => {
      request(url)
        .post(`${path}/login`)
        .send({
          email: tmpStudent.email,
          password: '2222'
        })
        .expect(401)
        .end((err, res) => {
          assert.equal(res.statusCode, 401)
          done()
        })
    })

    it('.login student', done => {
      request(url)
        .post(`${path}/login`)
        .send(tmpStudent)
        .expect(200)
        .end((err, res) => {
          agent.saveCookies(res)
          assert.equal(res.statusCode, 200)
          assert.hasOwnProperty(res.body, 'student')
          assert.equal(res.body.student.name, tmpStudent.name)
          assert.equal(res.body.student.email, tmpStudent.email)
          done()
        })
    })

    it('.check student status', done => {
      let req = request(url)
        .get(`${path}/status`)
      agent.attachCookies(req)
      req.end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.student.name, tmpStudent.name)
        assert.equal(res.body.student.email, tmpStudent.email)
        done()
      })
    })

    it('.login company with not correct password', done => {
      request(url)
        .post(`${path}/login`)
        .send({
          email: tmpCompany.email,
          password: '2222'
        })
        .expect(401)
        .end((err, res) => {
          assert.equal(res.statusCode, 401)
          done()
        })
    })

    it('.login company', done => {
      request(url)
        .post(`${path}/login`)
        .send(tmpCompany)
        .expect(200)
        .end((err, res) => {
          agent.saveCookies(res)
          assert.equal(res.statusCode, 200)
          assert.hasOwnProperty(res.body, 'company')
          assert.equal(res.body.company.name.name, tmpCompany.name)
          assert.equal(res.body.company.email, tmpCompany.email)
          done()
        })
    })

    it('.check company status', done => {
      let req = request(url)
        .get(`${path}/status`)
      agent.attachCookies(req)
      req.end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.company.name.name, tmpCompany.name)
        assert.equal(res.body.company.email, tmpCompany.email)
        done()
      })
    })



  })
}