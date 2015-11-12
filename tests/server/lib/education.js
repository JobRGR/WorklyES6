import {assert} from 'chai'
import request from 'supertest'

export default (url) => {
  const path = '/api/education'
  let tmpData = {start: new Date('09-01-2012'), end: new Date('07-01-2017')}
  let newTmpData = {start: new Date('09-01-2011'), end: new Date('07-01-2018')}

  let tmpModel = null
  let list = null

  describe('education tests', () => {
    it('.get list', (done) => {
      request(url)
        .get(path)
        .end((err, res) =>  {
          list = res.body.educations || []
          assert.equal(res.status, 200)
          assert.property(res.body, 'educations')
          assert.isAbove(res.body.educations.length, 0)
          done()
        })
    })

    it('.get random item', (done) => {
      const index = parseInt(list.length * Math.random())
      request(url)
        .get(`${path}/${list[index]._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'education')
          assert.property(res.body.education, 'start')
          assert.property(res.body.education, 'end')
          assert.property(res.body.education, 'speciality')
          assert.property(res.body.education, 'university')
          assert.equal(res.body.education.start, list[index].start)
          assert.equal(res.body.education.end, list[index].end)
          assert.equal(res.body.education._id, list[index]._id)
          assert.isObject(res.body.education.speciality)
          assert.isObject(res.body.education.university)
          assert.deepEqual(res.body.education.speciality, list[index].speciality)
          assert.deepEqual(res.body.education.university, list[index].university)
          done()
        })
    })

    it('.get count', (done) => {
      request(url)
        .get(`${path}-count`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'count')
          assert.equal(res.body.count, list.length)
          done()
        })
    })

    it('.set item', (done) => {
      const index = parseInt(list.length * Math.random())
      tmpData.speciality = list[index].speciality._id
      tmpData.university = list[index].university._id
      request(url)
        .post(path)
        .send(tmpData)
        .end(((err, res) => {
          tmpModel = res.body.education || {}
          assert.equal(res.status, 200)
          assert.property(res.body, 'education')
          assert.property(res.body.education, 'start')
          assert.property(res.body.education, 'end')
          assert.property(res.body.education, 'speciality')
          assert.property(res.body.education, 'university')
          assert.equal(res.body.education.start, tmpData.start.toISOString())
          assert.equal(res.body.education.end, tmpData.end.toISOString())
          assert.equal(res.body.education.speciality, tmpData.speciality)
          assert.equal(res.body.education.university, tmpData.university)
          done()
        }))
    })

    it('.check set', (done) => {
      console.log(list.length)
      request(url)
        .get(`${path}-count`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'count')
          assert.equal(res.body.count, list.length + 1)
          done()
        })
    })

    it('.put item', (done) => {
      const index = parseInt(list.length * Math.random())
      newTmpData.speciality = list[index].speciality._id
      newTmpData.university = list[index].university._id
      request(url)
        .put(`${path}/${tmpModel._id}`)
        .send(newTmpData)
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.property(res.body, 'education')
          assert.property(res.body.education, 'start')
          assert.property(res.body.education, 'end')
          assert.property(res.body.education, 'speciality')
          assert.property(res.body.education, 'university')
          assert.equal(res.body.education.start, newTmpData.start.toISOString())
          assert.equal(res.body.education.end, newTmpData.end.toISOString())
          assert.equal(res.body.education.speciality, newTmpData.speciality)
          assert.equal(res.body.education.university, newTmpData.university)
          done()
        })
    })

    it('.check put item', (done) => {
      request(url)
        .get(`${path}/${tmpModel._id}`)
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.property(res.body, 'education')
          assert.property(res.body.education, 'start')
          assert.property(res.body.education, 'end')
          assert.property(res.body.education, 'speciality')
          assert.property(res.body.education, 'university')
          assert.equal(res.body.education.start, newTmpData.start.toISOString())
          assert.equal(res.body.education.end, newTmpData.end.toISOString())
          assert.isObject(res.body.education.speciality)
          assert.isObject(res.body.education.university)
          assert.equal(res.body.education.speciality._id, newTmpData.speciality)
          assert.equal(res.body.education.university._id, newTmpData.university)
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

    it('.random', (done) => {
      request(url)
        .get(`${path}-random`)
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.property(res.body, 'education')
          assert.property(res.body.education, 'start')
          assert.property(res.body.education, 'end')
          assert.property(res.body.education, 'speciality')
          assert.property(res.body.education, 'university')
          assert.isString(res.body.education.start)
          assert.isString(res.body.education.end)
          assert.isObject(res.body.education.speciality)
          assert.isObject(res.body.education.university)
          done()
        })
    })
  })
}