import {assert} from 'chai'
import request from 'supertest'
import count from '../helpers/count'
import deleteItem from '../helpers/delete'
import superagent from 'superagent'


export default (url) => {
  const path = '/api/statistic'

  let allCount = 0
  let apiCount = 0
  let apiPartCount = 0

  describe('company error tests', () => {

    it('.get all', done => {
      request(url)
        .post(`${path}`)
        .send({})
        .expect(200)
        .end((err, res) => {
          assert.property(res.body, 'statistic')
          assert.isAbove(res.body.statistic.length, 0)
          allCount = res.body.statistic.length
          done()
        })
    })

    it('.get some api', done => {
      request(url)
        .post(path)
        .send({name: 'student'})
        .expect(200)
        .end((err, res) => {
          assert.property(res.body, 'statistic')
          assert.isAbove(res.body.statistic.length, 0)
          apiCount = res.body.statistic.length
          done()
        })
    })

    it('.get some api with options', done => {
      request(url)
        .post(path)
        .send({name: 'student', type: 'put', status: 200})
        .expect(200)
        .end((err, res) => {
          assert.property(res.body, 'statistic')
          assert.isAbove(res.body.statistic.length, 0)
          apiPartCount = res.body.statistic.length
          done()
        })
    })

    it('.get percent of some api request to all', done => {
      request(url)
        .post(`${path}/count`)
        .send({name: 'student', type: 'put', status: 200})
        .expect(200)
        .end((err, res) => {
          assert.property(res.body, 'value')
          assert.equal(res.body.value, apiPartCount * 100 / (allCount + 3))
          done()
        })
    })

    it('.get percent of some api request to all api request', done => {
      request(url)
        .post(`${path}/count/type`)
        .send({name: 'student', type: 'put', status: 200})
        .expect(200)
        .end((err, res) => {
          assert.property(res.body, 'value')
          assert.isAbove(res.body.value, apiPartCount * 100 / (apiCount + 4))
          done()
        })
    })
  })
}