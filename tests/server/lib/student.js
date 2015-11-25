import {assert} from 'chai'
import request from 'supertest'
import count from '../helpers/count'
import deleteItem from '../helpers/delete'
import superagent from 'superagent'
let agent = superagent.agent()

export default (url) => {
  const path = '/api/student'
  let list = []

  let tmpStudent = {name: 'Alex Loud', password: '1111', email: 'alex@gmail.com'}
  let tmpModel = null

  describe('student tests', () => {
    let getSession = done => {
      let req = request(url)
        .get(`${path}-status`)
      agent.attachCookies(req)

      req.end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'student')
        assert.equal(res.body.student.name, tmpStudent.name)
        assert.equal(res.body.student.email, tmpStudent.email)
        assert.notProperty(res.body.student, 'salt')
        assert.notProperty(res.body.student, 'hashedPassword')
        done()
      })
    }

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
          agent.saveCookies(res)
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

    it('.get session set student', getSession)

    it('.login student', done => {
      request(url)
        .post(`${path}-login`)
        .send(tmpStudent)
        .end((err, res) => {
          agent.saveCookies(res)
          assert.equal(res.status, 200)
          assert.property(res.body, 'student')
          assert.equal(res.body.student.name, tmpStudent.name)
          assert.equal(res.body.student.email, tmpStudent.email)
          assert.notProperty(res.body.student, 'salt')
          assert.notProperty(res.body.student, 'hashedPassword')
          done()
        })
    })

    it('.get session login student', getSession)

    it('.delete item', done => deleteItem(url, `${path}/${tmpModel._id}`, done))

    it('.check get delete', done => count(url, path, list.length, done))

    it('.search by city', done => {
      const city = list[Math.floor(list.length * Math.random())].city.name
      request(url)
        .post(`${path}-search`)
        .send({city})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'students')
          assert.isAbove(res.body.students.length, 0);
          res.body.students.forEach((item) => assert.equal(item.city.name, city))
          done()
        })
    })

    it('.search by skill', done => {
      const skill = list[Math.floor(list.length * Math.random())].skill.map(({name}) => name)
      request(url)
        .post(`${path}-search`)
        .send({skill})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'students')
          assert.isAbove(res.body.students.length, 0)
          res.body.students.forEach((item) => {
            let cur = item.skill.map(({name}) => name).filter(name => skill.indexOf(name) > -1)
            //assert.isAbove(cur.length, 0)
            assert.includeMembers(skill, cur)
          })
          done()
        })
    })

    it('.search by skill and city', done => {
      const someStudent = list[Math.floor(list.length * Math.random())]
      const skill = someStudent.skill.map(({name}) => name)
      const city = someStudent.city.name
      request(url)
        .post(`${path}-search`)
        .send({skill, city})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'students')
          assert.isAbove(res.body.students.length, 0)
          res.body.students.forEach((item) => {
            let cur = item.skill.map(({name}) => name).filter(name => skill.indexOf(name) > -1)
            //assert.isAbove(cur.length, 0)
            assert.equal(item.city.name, city)
            assert.includeMembers(skill, cur)
          })
          done()
        })
    })

    it('.search by email', done => {
      const someStudent = list[Math.floor(list.length * Math.random())]
      const {email} = someStudent
      request(url)
        .post(`${path}-search`)
        .send({email})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'students')
          assert.isAbove(res.body.students.length, 0)
          res.body.students.forEach((item) => {
            assert.equal(item.email, email)
          })
          done()
        })
    })

    it('.search by name', done => {
      const someStudent = list[Math.floor(list.length * Math.random())]
      const {name} = someStudent
      request(url)
        .post(`${path}-search`)
        .send({name})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'students')
          assert.isAbove(res.body.students.length, 0)
          res.body.students.forEach((item) => {
            assert.equal(item.name, name)
          })
          done()
        })
    })

    it('.search by name and email', done => {
      const someStudent = list[Math.floor(list.length * Math.random())]
      const {name, email} = someStudent
      request(url)
        .post(`${path}-search`)
        .send({name, email})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'students')
          assert.isAbove(res.body.students.length, 0)
          res.body.students.forEach((item) => {
            assert.equal(item.name, name)
            assert.equal(item.email, email)
          })
          done()
        })
    })

    it('.search by age', done => {
      const someStudent = list[Math.floor(list.length * Math.random())]
      let date = new Date(someStudent.dob)
      let age = (new Date()).getFullYear() - date.getFullYear()
      let above = date.getFullYear() + 1
      let below = date.getFullYear() - 1
      request(url)
        .post(`${path}-search`)
        .send({age: {min: age + 1, max: age - 1}})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'students')
          assert.isAbove(res.body.students.length, 0)
          res.body.students.forEach((item) => {
            let cur = new Date(item.dob).getFullYear()
            console.log(item.dob, someStudent.dob)
            assert(cur >= below)
            assert(cur <= above)
          })
          done()
        })
    })
  })
}