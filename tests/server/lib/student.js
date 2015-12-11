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

    let checkLogin = () => {
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
          assert.property(res.body.student, 'createdAt')
          assert.property(res.body.student, 'updatedAt')
          assert.property(res.body.student, 'about')
          assert.property(res.body.student, 'experiences')
          assert.property(res.body.student, 'city')
          assert.property(res.body.student, 'skills')
          assert.property(res.body.student, 'educations')
          assert.equal(res.body.student.dob, list[index].dob)
          assert.equal(res.body.student.telephone, list[index].telephone)
          assert.equal(res.body.student.name, list[index].name)
          assert.equal(res.body.student.email, list[index].email)
          assert.equal(res.body.student._id, list[index]._id)
          assert.isArray(res.body.student.educations)
          assert.isArray(res.body.student.skills)
          assert.isArray(res.body.student.experiences)
          assert.isObject(res.body.student.city)
          assert.deepEqual(res.body.student.skills, list[index].skills)
          assert.deepEqual(res.body.student.educations, list[index].educations)
          assert.deepEqual(res.body.student.experiences, list[index].experiences)
          assert.deepEqual(res.body.student.city, list[index].city)
          assert.isObject(res.body.student.experiences[0].position)
          assert.isObject(res.body.student.experiences[0].companyName)
          assert.isObject(res.body.student.educations[0].university)
          assert.isObject(res.body.student.educations[0].speciality)
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

    checkLogin()

    it('.change my password', done => {
      tmpStudent.password = '2222'
      let req = request(url).put(`${path}-password`)
      agent.attachCookies(req)
      req.send({password: tmpStudent.password})
      req.end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'ok')
        done()
      })
    })

    checkLogin()

    it('.change password', done => {
      tmpStudent.password = '111'
      request(url)
        .put(`${path}-password/${tmpModel._id}`)
        .send({password: tmpStudent.password})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'ok')
          done()
        })
    })

    checkLogin()

    it('.change my email', done => {
      tmpStudent.email = 'alex2@gmail.com'
      let req = request(url).put(`${path}-email`)
      agent.attachCookies(req)
      req.send({email: tmpStudent.email})
      req.end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'ok')
        done()
      })
    })

    checkLogin()

    it('.change email', done => {
      tmpStudent.email = 'alex1@gmail.com'
      request(url)
        .put(`${path}-email/${tmpModel._id}`)
        .send({email: tmpStudent.email})
        .end((err, res) => {
          console.log(res.body)
          assert.equal(res.status, 200)
          assert.property(res.body, 'ok')
          done()
        })
    })

    it('.get check change email', done => {
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

    it('.change user by id', done => {
      const index = Math.floor(list.length * Math.random())
      tmpStudent.city = list[index].city.name
      tmpStudent.skills = list[index].skills.map(item => item.name)
      tmpStudent.educations = list[index].educations.map(({start, end, speciality, university}) => {
        return {
          start, end,
          speciality: speciality.name,
          university: university.name
        }
      })
      request(url)
        .put(`${path}-update/${tmpModel._id}`)
        .send(tmpStudent)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'student')
          assert.property(res.body.student, 'email')
          assert.property(res.body.student, 'name')
          assert.property(res.body.student, 'city')
          assert.property(res.body.student, 'skills')
          assert.property(res.body.student, 'educations')
          assert.equal(res.body.student.name, tmpStudent.name)
          assert.equal(res.body.student.email, tmpStudent.email)
          assert.equal(res.body.student._id, tmpModel._id)
          assert.isArray(res.body.student.educations)
          assert.isArray(res.body.student.skills)
          assert.isAbove(res.body.student.skills.length, 0)
          assert.isAbove(res.body.student.educations.length, 0)
          assert.notProperty(res.body.student, 'salt')
          assert.notProperty(res.body.student, 'hashedPassword')
          done()
        })
    })

    it('.change my data', done => {
      const index = Math.floor(list.length * Math.random())
      tmpStudent.dob = list[index].dob
      tmpStudent.telephone = list[index].telephone
      tmpStudent.experiences = list[index].experiences.map(({start, end, companyName, position, about}) => {
        return {
          start, end, about,
          companyName: companyName.name,
          position: position.name
        }
      })
      let req = request(url).put(`${path}-update`)
      agent.attachCookies(req)
      req.send(tmpStudent)
      req.end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'student')
        assert.property(res.body.student, 'dob')
        assert.property(res.body.student, 'telephone')
        assert.property(res.body.student, 'email')
        assert.property(res.body.student, 'name')
        assert.property(res.body.student, 'city')
        assert.property(res.body.student, 'skills')
        assert.property(res.body.student, 'educations')
        assert.equal(res.body.student.name, tmpStudent.name)
        assert.equal(res.body.student.email, tmpStudent.email)
        assert.equal(res.body.student._id, tmpModel._id)
        assert.isArray(res.body.student.educations)
        assert.isArray(res.body.student.skills)
        assert.isArray(res.body.student.experiences)
        assert.isAbove(res.body.student.skills.length, 0)
        assert.isAbove(res.body.student.educations.length, 0)
        assert.isAbove(res.body.student.experiences.length, 0)
        assert.notProperty(res.body.student, 'salt')
        assert.notProperty(res.body.student, 'hashedPassword')
        done()
      })
    })

    it('.check change', done => {
      request(url)
        .get(`${path}/${tmpModel._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'student')
          assert.property(res.body.student, 'telephone')
          assert.property(res.body.student, 'email')
          assert.property(res.body.student, 'name')
          assert.property(res.body.student, 'createdAt')
          assert.property(res.body.student, 'experiences')
          assert.property(res.body.student, 'city')
          assert.property(res.body.student, 'skills')
          assert.property(res.body.student, 'educations')
          assert.equal(res.body.student.telephone, tmpStudent.telephone)
          assert.equal(res.body.student.name, tmpStudent.name)
          assert.equal(res.body.student.email, tmpStudent.email)
          assert.equal(res.body.student._id, tmpModel._id)
          assert.isArray(res.body.student.educations)
          assert.isArray(res.body.student.skills)
          assert.isArray(res.body.student.experiences)
          assert.isObject(res.body.student.city)
          res.body.student.skills.forEach((item, index) => assert.equal(item.name, tmpStudent.skills[index]))
          res.body.student.educations.forEach((item, index) => {
            assert.equal(item.university.name, tmpStudent.educations[index].university)
            assert.equal(item.speciality.name, tmpStudent.educations[index].speciality)
            assert.equal(item.start, tmpStudent.educations[index].start)
            assert.equal(item.end, tmpStudent.educations[index].end)
          })
          res.body.student.experiences.forEach((item, index) => {
            assert.equal(item.companyName.name, tmpStudent.experiences[index].companyName)
            assert.equal(item.position.name, tmpStudent.experiences[index].position)
            assert.equal(item.about, tmpStudent.experiences[index].about)
            assert.equal(item.start, tmpStudent.experiences[index].start)
            assert.equal(item.end, tmpStudent.experiences[index].end)
          })
          assert.equal(res.body.student.city.name, tmpStudent.city)
          assert.isObject(res.body.student.experiences[0].position)
          assert.isObject(res.body.student.experiences[0].companyName)
          assert.isObject(res.body.student.educations[0].university)
          assert.isObject(res.body.student.educations[0].speciality)
          assert.notProperty(res.body.student, 'salt')
          assert.notProperty(res.body.student, 'hashedPassword')
          done()
        })
    })

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

    it('.search by skills', done => {
      const skills = list[Math.floor(list.length * Math.random())].skills.map(({name}) => name)
      request(url)
        .post(`${path}-search`)
        .send({skills})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'students')
          assert.isAbove(res.body.students.length, 0)
          res.body.students.forEach((item) => {
            let cur = item.skills.map(({name}) => name).filter(name => skills.indexOf(name) > -1)
            //assert.isAbove(cur.length, 0)
            assert.includeMembers(skills, cur)
          })
          done()
        })
    })

    it('.search by skills and city', done => {
      const someStudent = list[Math.floor(list.length * Math.random())]
      const skills = someStudent.skills.map(({name}) => name)
      const city = someStudent.city.name
      request(url)
        .post(`${path}-search`)
        .send({skills, city})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'students')
          assert.isAbove(res.body.students.length, 0)
          res.body.students.forEach((item) => {
            let cur = item.skills.map(({name}) => name).filter(name => skills.indexOf(name) > -1)
            //assert.isAbove(cur.length, 0)
            assert.equal(item.city.name, city)
            assert.includeMembers(skills, cur)
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
            assert(cur >= below)
            assert(cur <= above)
          })
          done()
        })
    })

    it('.search by age and name', done => {
      const someStudent = list[Math.floor(list.length * Math.random())]
      const name = someStudent.name
      let date = new Date(someStudent.dob)
      let age = (new Date()).getFullYear() - date.getFullYear()
      let above = date.getFullYear() + 1
      let below = date.getFullYear() - 1
      request(url)
        .post(`${path}-search`)
        .send({age: {min: age + 1, max: age - 1}, name})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'students')
          assert.isAbove(res.body.students.length, 0)
          res.body.students.forEach((item) => {
            let cur = new Date(item.dob).getFullYear()
            assert.equal(item.name, name)
            assert(cur >= below)
            assert(cur <= above)
          })
          done()
        })
    })

    it('.search by speciality', done => {
      const someStudent = list[Math.floor(list.length * Math.random())]
      const speciality = someStudent.educations[0].speciality.name
      request(url)
        .post(`${path}-search`)
        .send({speciality})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'students')
          assert.isAbove(res.body.students.length, 0)
          res.body.students.forEach(item => assert.include(item.educations.map(x => x.speciality.name), speciality))
          done()
        })
    })

    it('.search by university', done => {
      const someStudent = list[Math.floor(list.length * Math.random())]
      const university = someStudent.educations[0].university.name
      request(url)
        .post(`${path}-search`)
        .send({university})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'students')
          assert.isAbove(res.body.students.length, 0)
          res.body.students.forEach(item => assert.include(item.educations.map(x => x.university.name), university))
          done()
        })
    })

    it('.search by position', done => {
      const someStudent = list[Math.floor(list.length * Math.random())]
      const position = someStudent.experiences[0].position.name
      request(url)
        .post(`${path}-search`)
        .send({position})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'students')
          assert.isAbove(res.body.students.length, 0)
          res.body.students.forEach(item => assert.include(item.experiences.map(x => x.position.name), position))
          done()
        })
    })

    it('.search by company name', done => {
      const someStudent = list[Math.floor(list.length * Math.random())]
      const companyName = someStudent.experiences[0].companyName.name
      request(url)
        .post(`${path}-search`)
        .send({companyName})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'students')
          assert.isAbove(res.body.students.length, 0)
          res.body.students.forEach(item => assert.include(item.experiences.map(x => x.companyName.name), companyName))
          done()
        })
    })

    it('.search by company name and age', done => {
      const someStudent = list[Math.floor(list.length * Math.random())]
      const companyName = someStudent.experiences[0].companyName.name
      let date = new Date(someStudent.dob)
      let age = (new Date()).getFullYear() - date.getFullYear()
      let above = date.getFullYear() + 1
      let below = date.getFullYear() - 1
      request(url)
        .post(`${path}-search`)
        .send({age: {min: age + 1, max: age - 1}, companyName})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'students')
          assert.isAbove(res.body.students.length, 0)
          res.body.students.forEach(item => {
            let cur = new Date(item.dob).getFullYear()
            assert(cur >= below)
            assert(cur <= above)
            assert.include(item.experiences.map(x => x.companyName.name), companyName)
          })
          done()
        })
    })

    it('.search by position and age', done => {
      const someStudent = list[Math.floor(list.length * Math.random())]
      const position = someStudent.experiences[0].position.name
      let date = new Date(someStudent.dob)
      let age = (new Date()).getFullYear() - date.getFullYear()
      let above = date.getFullYear() + 1
      let below = date.getFullYear() - 1
      request(url)
        .post(`${path}-search`)
        .send({age: {min: age + 1, max: age - 1}, position})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'students')
          assert.isAbove(res.body.students.length, 0)
          res.body.students.forEach(item => {
            let cur = new Date(item.dob).getFullYear()
            assert(cur >= below)
            assert(cur <= above)
            assert.include(item.experiences.map(x => x.position.name), position)
          })
          done()
        })
    })
  })
}
