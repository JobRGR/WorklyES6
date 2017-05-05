import {assert} from 'chai'
import request from 'supertest'
import count from '../helpers/count'
import deleteItem from '../helpers/delete'


export default (url) => {
  const path = '/api/education'
  let tmpData = {start: new Date('09-01-2012'), end: new Date('07-01-2017')}
  let newTmpData = {start: new Date('09-01-2011'), end: new Date('07-01-2018')}

  let newData = {
    start: new Date('09-01-2012'), end: new Date('07-01-2017'),
    university: 'Stanford', speciality: 'Computer Science'
  }

  let editNewData = {
    start: new Date('01-01-2012'), end: new Date('01-01-2017'),
    university: 'Stanford', speciality: 'Computer Science'
  }

  let newDataReturn = {}
  let newUniversity = null
  let newSpeciality = null

  let tmpModel = null
  let list = null
  let curCount = null

  describe('education tests', () => {
    before(done => {
      request(url)
        .get(`${path}-count`)
        .end((err, res) => {
          curCount = res.body.count
          done()
        })
    })

    it('.get list', done => {
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

    it('.get random item', done => {
      const index = Math.floor(list.length * Math.random())
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

    it('.get count', done => count(url, path, curCount, done))

    it('.set item', done => {
      const index = Math.floor(list.length * Math.random())
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

    it('.check set', done => count(url, path, curCount + 1, done))

    it('.put item', done => {
      const index = Math.floor(list.length * Math.random())
      newTmpData.speciality = list[index].speciality._id
      newTmpData.university = list[index].university._id
      request(url)
        .put(`${path}/${tmpModel._id}`)
        .send(newTmpData)
        .end((err, res) => {
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

    it('.check put item', done => {
      request(url)
        .get(`${path}/${tmpModel._id}`)
        .end((err, res) => {
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

    it('.delete item', done => deleteItem(url, `${path}/${tmpModel._id}`, done))

    it('.check get delete', done => count(url, path, curCount, done))

    it('.random', done => {
      request(url)
        .get(`${path}-random`)
        .end((err, res) => {
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


    it('.add new item', done => {
      request(url)
        .post(`${path}-add`)
        .send(newData)
        .end(((err, res) => {
          newDataReturn = res.body.education || {}
          assert.equal(res.status, 200)
          assert.property(res.body, 'education')
          assert.property(res.body.education, 'start')
          assert.property(res.body.education, 'end')
          assert.property(res.body.education, 'speciality')
          assert.property(res.body.education, 'university')
          assert.equal(res.body.education.start, newData.start.toISOString())
          assert.equal(res.body.education.end, newData.end.toISOString())
          done()
        }))
    })

    it('.check add new item', done => {
      request(url)
        .get(`${path}/${newDataReturn._id}`)
        .end((err, res) => {
          newSpeciality = res.body.education.speciality || null
          newUniversity = res.body.education.university || null
          assert.equal(res.status, 200)
          assert.property(res.body, 'education')
          assert.property(res.body.education, 'start')
          assert.property(res.body.education, 'end')
          assert.property(res.body.education, 'speciality')
          assert.property(res.body.education, 'university')
          assert.equal(res.body.education.start, newData.start.toISOString())
          assert.equal(res.body.education.end, newData.end.toISOString())
          assert.isObject(res.body.education.speciality)
          assert.isObject(res.body.education.university)
          assert.equal(res.body.education.speciality._id, newDataReturn.speciality)
          assert.equal(res.body.education.university._id, newDataReturn.university)
          done()
        })
    })

    it('.put new item', done => {
      request(url)
        .put(`${path}-update/${newDataReturn._id}`)
        .send(editNewData)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'education')
          assert.property(res.body.education, 'start')
          assert.property(res.body.education, 'end')
          assert.property(res.body.education, 'speciality')
          assert.property(res.body.education, 'university')
          assert.equal(res.body.education.start, editNewData.start.toISOString())
          assert.equal(res.body.education.end, editNewData.end.toISOString())
          assert.equal(res.body.education.speciality._id, newDataReturn.speciality._id)
          assert.equal(res.body.education.university._id, newDataReturn.university._id)
          done()
        })
    })

    it('.delete item', done => deleteItem(url, `${path}/${newDataReturn._id}`, done))

    it('.get new university', done => {
      request(url)
        .get(`/api/university/${newUniversity._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'university')
          assert.property(res.body.university, 'name')
          assert.equal(res.body.university.name, newData.university)
          assert.equal(res.body.university._id, newUniversity._id)
          done()
        })
    })

    it('.delete new university', done => deleteItem(url, `/api/university/${newUniversity._id}`, done))

    it('.get new speciality', done => {
      request(url)
        .get(`/api/speciality/${newSpeciality._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'speciality')
          assert.property(res.body.speciality, 'name')
          assert.equal(res.body.speciality.name, newData.speciality)
          assert.equal(res.body.speciality._id, newSpeciality._id)
          done()
        })
    })

    it('.delete new speciality', done => deleteItem(url, `/api/speciality/${newSpeciality._id}`, done))
    
    it('.search education by university', done => {
      const index = Math.floor(list.length * Math.random())
      request(url)
        .post(`${path}-search`)
        .send({university: list[index].university.name})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.status, 200)
          assert.property(res.body, 'educations')
          assert.isAbove(res.body.educations.length, 0)
          res.body.educations.forEach((item) => assert.equal(item.university.name, list[index].university.name))
          done()
        })
    })

    it('.search education by speciality', done => {
      const index = Math.floor(list.length * Math.random())
      request(url)
        .post(`${path}-search`)
        .send({speciality: list[index].speciality.name})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'educations')
          assert.isAbove(res.body.educations.length, 0)
          res.body.educations.forEach((item) => assert.equal(item.speciality.name, list[index].speciality.name))
          done()
        })
    })

    it('.search education by company position and company', done => {
      const index = Math.floor(list.length * Math.random())
      request(url)
        .post(`${path}-search`)
        .send({
          university: list[index].university.name,
          speciality: list[index].speciality.name
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'educations')
          assert.isAbove(res.body.educations.length, 0)
          res.body.educations.forEach((item) => {
            assert.equal(item.speciality.name, list[index].speciality.name)
            assert.equal(item.university.name, list[index].university.name)
          })
          done()
        })
    })
  })
}