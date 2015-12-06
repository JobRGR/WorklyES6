import {assert} from 'chai'
import request from 'supertest'
import count from '../helpers/count'
import deleteItem from '../helpers/delete'
import superagent from 'superagent'


export default (url) => {
  const path = '/api/student'

  let tmpStudent = {name: 'Alex Loud', password: '1111', email: 'alex@gmail.com'}
  let tmpModel = null

  describe('student error tests', () => {
    before(done =>
      request(url)
        .post(path)
        .send(tmpStudent)
        .end((err, res) => {
          tmpModel = res.body.student || {}
          done()
        }))

    after(done => deleteItem(url, `${path}/${tmpModel._id}`, done))


    it('.login student with not correct password', done => {
      let someStudent = {
        email: tmpStudent.email,
        password: '2222'
      }
      request(url)
        .post(`${path}-login`)
        .send(someStudent)
        .expect(401)
        .end((err, res) => {
          assert.equal(res.body.message, 'Not correct password')
          done()
        })
    })

    it('.login student with not correct email', done => {
      let someStudent = {
        email: tmpStudent.email + '1',
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


    it('.error change my password', done => {
      request(url)
        .put(`${path}-password`)
        .send(tmpStudent)
        .expect(401)
        .end((err, res) => {
          console.log(res.body.message, 'Unauthorized')
          done()
        })
    })

    it('.error change my email', done => {
      request(url)
        .put(`${path}-email`)
        .send(tmpStudent)
        .expect(401)
        .end((err, res) => {
          console.log(res.body.message, 'Unauthorized')
          done()
        })
    })

  })
}