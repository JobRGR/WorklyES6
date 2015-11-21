import {assert} from 'chai'
import request from 'supertest'
import count from '../helpers/count'
import deleteItem from '../helpers/delete'

export default (url) => {
  const path = '/api/student'
  let list = []

  let tmpStudent = {name: 'Alex Loud', password: '1111', email: 'alex@gmail.com'}
  let tmpModel = null

  describe('student tests', () => {
    it('.get list', done => {
      request(url)
        .get(path)
        .end((err, res) => {
          list = res.body.students || []
          assert.equal(res.status, 200)
          assert.property(res.body, 'students')
          assert.isAbove(res.body.students.length, 0)
          done()
        })
    })

    it('.get item by id', done => {
      const index = Math.floor(list.length * Math.random())
      request(url)
        .get(`${path}/${list[index]._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'student')
          assert.property(res.body.student, 'dob')
          assert.property(res.body.student, 'telephone')
          assert.property(res.body.student, 'email')
          assert.property(res.body.student, 'name')
          assert.property(res.body.student, 'date')
          assert.property(res.body.student, 'about')
          assert.property(res.body.student, 'experience')
          assert.property(res.body.student, 'city')
          assert.property(res.body.student, 'skill')
          assert.property(res.body.student, 'education')
          assert.equal(res.body.student.dob, list[index].dob)
          assert.equal(res.body.student.telephone, list[index].telephone)
          assert.equal(res.body.student.name, list[index].name)
          assert.equal(res.body.student.email, list[index].email)
          assert.equal(res.body.student._id, list[index]._id)
          assert.isArray(res.body.student.education)
          assert.isArray(res.body.student.skill)
          assert.isArray(res.body.student.experience)
          assert.isObject(res.body.student.city)
          assert.deepEqual(res.body.student.skill, list[index].skill)
          assert.deepEqual(res.body.student.education, list[index].education)
          assert.deepEqual(res.body.student.experience, list[index].experience)
          assert.deepEqual(res.body.student.city, list[index].city)
          assert.notProperty(res.body.student, 'salt')
          assert.notProperty(res.body.student, 'hashedPassword')
          done()
        })
    })

    it('.get count', done => count(url, path, list.length, done))

    it('.set new student', done => {
      request(url)
        .post(path)
        .send(tmpStudent)
        .end((err, res) => {
          tmpModel = res.body.student || {}
          assert.equal(res.status, 200)
          assert.property(res.body, 'student')
          assert.equal(res.body.student.name, tmpStudent.name)
          assert.equal(res.body.student.email, tmpStudent.email)
          assert.notProperty(res.body.student, 'salt')
          assert.notProperty(res.body.student, 'hashedPassword')
          done()
        })
    })

    it('.check set student', done => count(url, path, list.length + 1, done))

    it('.get new student', done => {
      request(url)
        .get(`${path}/${tmpModel._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'student')
          assert.equal(res.body.student.name, tmpStudent.name)
          assert.equal(res.body.student.email, tmpStudent.email)
          assert.notProperty(res.body.student, 'salt')
          assert.notProperty(res.body.student, 'hashedPassword')
          done()
        })
    })

    xit('.get session student', done => {
      request(url)
        .get(`${path}-status`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'student')
          assert.equal(res.body.student.name, tmpStudent.name)
          assert.equal(res.body.student.email, tmpStudent.email)
          assert.notProperty(res.body.student, 'salt')
          assert.notProperty(res.body.student, 'hashedPassword')
          done()
        })
    })

    it('.delete item', done => deleteItem(url, `${path}/${tmpModel._id}`, done))

    it('.check get delete', done => count(url, path, list.length, done))
  })
}