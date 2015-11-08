import {assert} from 'chai'
import request from 'supertest'

const path = '/api/speciality'
const tmpData = {name: 'Some speciality'}
const newTmpData = {name: 'New speciality'}

let tmpModel = null
let list = null

export default (url) => {
  describe('.speciality', () => {
    it('.get list', (done) => {
      request(url)
        .get(path)
        .end(function(err, res) {
          list = res.body.specialities || []
          assert.equal(res.status, 200)
          assert.property(res.body, 'specialities')
          done()
        })
    })

    it('.get random item', (done) => {
      const index = parseInt(list.length * Math.random())
      request(url)
        .get(`${path}/${list[index]._id}`)
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.property(res.body, 'speciality')
          assert.property(res.body.speciality, 'name')
          assert.equal(res.body.speciality.name, list[index].name)
          assert.equal(res.body.speciality._id, list[index]._id)
          done()
        })
    })

    it('.get count', (done) => {
      request(url)
        .get(`${path}-count`)
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.property(res.body, 'count')
          assert.equal(res.body.count, list.length)
          done()
        })
    })

    it('.set item', (done) => {
      request(url)
        .post(path)
        .send(tmpData)
        .end(function(err, res) {
          tmpModel = res.body.speciality || {}
          assert.equal(res.status, 200)
          assert.property(res.body, 'speciality')
          assert.property(res.body.speciality, 'name')
          assert.equal(res.body.speciality.name, tmpData.name)
          done()
        })
    })

    it('.get item', (done) => {
      request(url)
        .get(`${path}/${tmpModel._id}`)
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.property(res.body, 'speciality')
          assert.property(res.body.speciality, 'name')
          assert.equal(res.body.speciality.name, tmpModel.name)
          assert.equal(res.body.speciality._id, tmpModel._id)
          done()
        })
    })

    it('.put item', (done) => {
      request(url)
        .put(`${path}/${tmpModel._id}`)
        .send(newTmpData)
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.property(res.body, 'speciality')
          assert.property(res.body.speciality, 'name')
          assert.equal(res.body.speciality.name, newTmpData.name)
          assert.equal(res.body.speciality._id, tmpModel._id)
          done()
        })
    })

    it('.check put item', (done) => {
      request(url)
        .get(`${path}/${tmpModel._id}`)
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.property(res.body, 'speciality')
          assert.property(res.body.speciality, 'name')
          assert.equal(res.body.speciality.name, newTmpData.name)
          assert.equal(res.body.speciality._id, tmpModel._id)
          done()
        })
    })

    it('.check get count', (done) => {
      request(url)
        .get(`${path}-count`)
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.property(res.body, 'count')
          assert.equal(res.body.count, list.length + 1)
          done()
        })
    })

    it('.delete item', (done) => {
      request(url)
        .delete(`${path}/${tmpModel._id}`)
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.property(res.body, 'ok')
          done()
        })
    })

    it('.check get delete', (done) => {
      request(url)
        .get(`${path}-count`)
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.property(res.body, 'count')
          assert.equal(res.body.count, list.length)
          done()
        })
    })
  })
}