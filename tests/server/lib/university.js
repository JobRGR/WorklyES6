import {assert} from 'chai'
import request from 'supertest'

const path = '/api/university'
const tmpData = {name: 'Some university'}
const newTmpData = {name: 'New university'}

let tmpModel = null
let list = null

export default (url) => {
  describe('.university', () => {
    it('.get list', (done) => {
      request(url)
        .get(path)
        .end(function(err, res) {
          list = res.body.universities || []
          assert.equal(res.status, 200)
          assert.property(res.body, 'universities')
          done()
        })
    })

    it('.get random item', (done) => {
      const index = parseInt(list.length * Math.random())
      request(url)
        .get(`${path}/${list[index]._id}`)
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.property(res.body, 'university')
          assert.property(res.body.university, 'name')
          assert.equal(res.body.university.name, list[index].name)
          assert.equal(res.body.university._id, list[index]._id)
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
          tmpModel = res.body.university || {}
          assert.equal(res.status, 200)
          assert.property(res.body, 'university')
          assert.property(res.body.university, 'name')
          assert.equal(res.body.university.name, tmpData.name)
          done()
        })
    })

    it('.get item', (done) => {
      request(url)
        .get(`${path}/${tmpModel._id}`)
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.property(res.body, 'university')
          assert.property(res.body.university, 'name')
          assert.equal(res.body.university.name, tmpModel.name)
          assert.equal(res.body.university._id, tmpModel._id)
          done()
        })
    })

    it('.put item', (done) => {
      request(url)
        .put(`${path}/${tmpModel._id}`)
        .send(newTmpData)
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.property(res.body, 'university')
          assert.property(res.body.university, 'name')
          assert.equal(res.body.university.name, newTmpData.name)
          assert.equal(res.body.university._id, tmpModel._id)
          done()
        })
    })

    it('.check put item', (done) => {
      request(url)
        .get(`${path}/${tmpModel._id}`)
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.property(res.body, 'university')
          assert.property(res.body.university, 'name')
          assert.equal(res.body.university.name, newTmpData.name)
          assert.equal(res.body.university._id, tmpModel._id)
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