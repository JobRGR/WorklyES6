import {assert} from 'chai'
import request from 'supertest'
import count from '../helpers/count'
import deleteItem from '../helpers/delete'
import superagent from 'superagent'


export default (url) => {
  const path = '/api/company'

  let tmpCompany = {name: 'InsSolutions', password: '1111', email: 'ins_solutins@somnia.com'}
  let tmpModel = null

  describe('company error tests', () => {
    before(done =>
      request(url)
        .post(path)
        .send(tmpCompany)
        .end((err, res) => {
          tmpModel = res.body.company || {}
          done()
        }))

    after(done => deleteItem(url, `${path}/${tmpModel._id}`, done))


    it('.login company with not correct password', done => {
      let someCompany = {
        email: tmpCompany.email,
        password: '2222'
      }
      request(url)
        .post(`${path}-login`)
        .send(someCompany)
        .expect(401)
        .end((err, res) => {
          assert.equal(res.body.message, 'Not correct password')
          done()
        })
    })

    it('.login company with not correct email', done => {
      let someStudent = {
        email: tmpCompany.email + '1',
        password: '111'
      }
      request(url)
        .post(`${path}-login`)
        .send(someStudent)
        .expect(401)
        .end((err, res) => {
          assert.equal(res.body.message, 'Not correct email')
          done()
        })
    })
  })
}