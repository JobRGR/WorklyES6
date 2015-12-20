import {assert} from 'chai'
import request from 'supertest'
import count from '../helpers/count'
import deleteItem from '../helpers/delete'
import superagent from 'superagent'
let agent = superagent.agent()

export default (url) => {
  const path = '/api/admin'

  let admin = {name: 'admin', password: 'admin'}

  describe('admin tests', () => {
    it('.login admin', done => {
      request(url)
        .post(`${path}-login`)
        .send(admin)
        .end((err, res) => {
          agent.saveCookies(res)
          assert.equal(res.status, 200)
          assert.property(res.body, 'admin')
          assert.equal(res.body.admin.name, admin.name)
          assert.notProperty(res.body.admin, 'salt')
          assert.notProperty(res.body.admin, 'hashedPassword')
          done()
        })
    })

    it('.login error', done => {
      request(url)
        .post(`${path}-login`)
        .send({name: 'admin', password: '1111'})
        .end((err, res) => {
          assert.equal(res.status, 401)
          assert.property(res.body, 'message')
          assert.equal(res.body.message, 'Not correct password')
          done()
        })
    })

    it('.get admin session', done => {
      let req = request(url)
        .get(`${path}-status`)
      agent.attachCookies(req)

      req.end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'admin')
        assert.equal(res.body.admin.name, admin.name)
        assert.notProperty(res.body.admin, 'salt')
        assert.notProperty(res.body.admin, 'hashedPassword')
        done()
      })
    })
  })
}
