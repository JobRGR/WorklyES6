import {assert} from 'chai'
import request from 'supertest'
import count from '../helpers/count'
import deleteItem from '../helpers/delete'


export default (url) => {
  const path = '/api/experience'
  let tmpData = {start: new Date('09-01-2012'), end: new Date('07-01-2017')}
  let newTmpData = {start: new Date('09-01-2011'), end: new Date('07-01-2018')}

  let newData = {
    start: new Date('09-01-2012'), end: new Date('07-01-2017'),
    companyName: 'Google', position: 'Data Analyst'
  }

  let editNewData = {
    start: new Date('01-01-2012'), end: new Date('01-01-2017'),
    companyName: 'Google', position: 'Data Analyst'
  }

  let newDataReturn = {}
  let newcompanyName = null
  let newposition = null

  let tmpModel = null
  let list = null

  let curCount = null

  describe('experience tests', () => {
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
          list = res.body.experiences || []
          assert.equal(res.status, 200)
          assert.property(res.body, 'experiences')
          assert.isAbove(res.body.experiences.length, 0)
          done()
        })
    })

    it('.get random item', done => {
      const index = Math.floor(list.length * Math.random())
      request(url)
        .get(`${path}/${list[index]._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'experience')
          assert.property(res.body.experience, 'start')
          assert.property(res.body.experience, 'end')
          assert.property(res.body.experience, 'position')
          assert.property(res.body.experience, 'companyName')
          assert.equal(res.body.experience.start, list[index].start)
          assert.equal(res.body.experience.end, list[index].end)
          assert.equal(res.body.experience._id, list[index]._id)
          assert.isObject(res.body.experience.position)
          assert.isObject(res.body.experience.companyName)
          assert.deepEqual(res.body.experience.position, list[index].position)
          assert.deepEqual(res.body.experience.companyName, list[index].companyName)
          done()
        })
    })

    it('.get count', done => count(url, path, curCount, done))

    it('.set item', done => {
      const index = Math.floor(list.length * Math.random())
      tmpData.position = list[index].position._id
      tmpData.companyName = list[index].companyName._id
      request(url)
        .post(path)
        .send(tmpData)
        .end(((err, res) => {
          tmpModel = res.body.experience || {}
          assert.equal(res.status, 200)
          assert.property(res.body, 'experience')
          assert.property(res.body.experience, 'start')
          assert.property(res.body.experience, 'end')
          assert.property(res.body.experience, 'position')
          assert.property(res.body.experience, 'companyName')
          assert.equal(res.body.experience.start, tmpData.start.toISOString())
          assert.equal(res.body.experience.end, tmpData.end.toISOString())
          assert.equal(res.body.experience.position, tmpData.position)
          assert.equal(res.body.experience.companyName, tmpData.companyName)
          done()
        }))
    })

    it('.check set', done => count(url, path, curCount + 1, done))

    it('.put item', done => {
      const index = Math.floor(list.length * Math.random())
      newTmpData.position = list[index].position._id
      newTmpData.companyName = list[index].companyName._id
      request(url)
        .put(`${path}/${tmpModel._id}`)
        .send(newTmpData)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'experience')
          assert.property(res.body.experience, 'start')
          assert.property(res.body.experience, 'end')
          assert.property(res.body.experience, 'position')
          assert.property(res.body.experience, 'companyName')
          assert.equal(res.body.experience.start, newTmpData.start.toISOString())
          assert.equal(res.body.experience.end, newTmpData.end.toISOString())
          assert.equal(res.body.experience.position, newTmpData.position)
          assert.equal(res.body.experience.companyName, newTmpData.companyName)
          done()
        })
    })

    it('.check put item', done => {
      request(url)
        .get(`${path}/${tmpModel._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'experience')
          assert.property(res.body.experience, 'start')
          assert.property(res.body.experience, 'end')
          assert.property(res.body.experience, 'position')
          assert.property(res.body.experience, 'companyName')
          assert.equal(res.body.experience.start, newTmpData.start.toISOString())
          assert.equal(res.body.experience.end, newTmpData.end.toISOString())
          assert.isObject(res.body.experience.position)
          assert.isObject(res.body.experience.companyName)
          assert.equal(res.body.experience.position._id, newTmpData.position)
          assert.equal(res.body.experience.companyName._id, newTmpData.companyName)
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
          assert.property(res.body, 'experience')
          assert.property(res.body.experience, 'start')
          assert.property(res.body.experience, 'end')
          assert.property(res.body.experience, 'position')
          assert.property(res.body.experience, 'companyName')
          assert.isString(res.body.experience.start)
          assert.isString(res.body.experience.end)
          assert.isObject(res.body.experience.position)
          assert.isObject(res.body.experience.companyName)
          done()
        })
    })


    it('.add new item', done => {
      request(url)
        .post(`${path}-add`)
        .send(newData)
        .end(((err, res) => {
          newDataReturn = res.body.experience || {}
          assert.equal(res.status, 200)
          assert.property(res.body, 'experience')
          assert.property(res.body.experience, 'start')
          assert.property(res.body.experience, 'end')
          assert.property(res.body.experience, 'position')
          assert.property(res.body.experience, 'companyName')
          assert.equal(res.body.experience.start, newData.start.toISOString())
          assert.equal(res.body.experience.end, newData.end.toISOString())
          done()
        }))
    })

    it('.check add new item', done => {
      request(url)
        .get(`${path}/${newDataReturn._id}`)
        .end((err, res) => {
          newposition = res.body.experience.position || null
          newcompanyName = res.body.experience.companyName || null
          assert.equal(res.status, 200)
          assert.property(res.body, 'experience')
          assert.property(res.body.experience, 'start')
          assert.property(res.body.experience, 'end')
          assert.property(res.body.experience, 'position')
          assert.property(res.body.experience, 'companyName')
          assert.equal(res.body.experience.start, newData.start.toISOString())
          assert.equal(res.body.experience.end, newData.end.toISOString())
          assert.isObject(res.body.experience.position)
          assert.isObject(res.body.experience.companyName)
          assert.equal(res.body.experience.position._id, newDataReturn.position)
          assert.equal(res.body.experience.companyName._id, newDataReturn.companyName)
          done()
        })
    })

    it('.put new item', done => {
      request(url)
        .put(`${path}-update/${newDataReturn._id}`)
        .send(editNewData)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'experience')
          assert.property(res.body.experience, 'start')
          assert.property(res.body.experience, 'end')
          assert.property(res.body.experience, 'position')
          assert.property(res.body.experience, 'companyName')
          assert.equal(res.body.experience.start, editNewData.start.toISOString())
          assert.equal(res.body.experience.end, editNewData.end.toISOString())
          assert.equal(res.body.experience.position._id, newDataReturn.position._id)
          assert.equal(res.body.experience.companyName._id, newDataReturn.companyName._id)
          done()
        })
    })

    it('.delete item', done => deleteItem(url, `${path}/${newDataReturn._id}`, done))

    it('.get new companyName', done => {
      request(url)
        .get(`/api/company-name/${newcompanyName._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'companyName')
          assert.property(res.body.companyName, 'name')
          assert.equal(res.body.companyName.name, newData.companyName)
          assert.equal(res.body.companyName._id, newcompanyName._id)
          done()
        })
    })

    it('.delete new companyName', done => deleteItem(url, `/api/company-name/${newcompanyName._id}`, done))

    it('.get new position', done => {
      request(url)
        .get(`/api/position/${newposition._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'position')
          assert.property(res.body.position, 'name')
          assert.equal(res.body.position.name, newData.position)
          assert.equal(res.body.position._id, newposition._id)
          done()
        })
    })

    it('.delete new position', done => deleteItem(url, `/api/position/${newposition._id}`, done))

    it('.search experience by companyName name', done => {
      const index = Math.floor(list.length * Math.random())
      request(url)
        .post(`${path}-search`)
        .send({companyName: list[index].companyName.name})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.status, 200)
          assert.property(res.body, 'experiences')
          assert.isAbove(res.body.experiences.length, 0)
          res.body.experiences.forEach((item) => assert.equal(item.companyName.name, list[index].companyName.name))
          done()
        })
    })

    it('.search experience by position', done => {
      const index = Math.floor(list.length * Math.random())
      request(url)
        .post(`${path}-search`)
        .send({position: list[index].position.name})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'experiences')
          assert.isAbove(res.body.experiences.length, 0)
          res.body.experiences.forEach((item) => assert.equal(item.position.name, list[index].position.name))
          done()
        })
    })

    it('.search experience by position and companyName', done => {
      const index = Math.floor(list.length * Math.random())
      request(url)
        .post(`${path}-search`)
        .send({
          position: list[index].position.name,
          companyName: list[index].companyName.name
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'experiences')
          assert.isAbove(res.body.experiences.length, 0)
          res.body.experiences.forEach((item) => {
            assert.equal(item.position.name, list[index].position.name)
            assert.equal(item.companyName.name, list[index].companyName.name)
          })
          done()
        })
    })
  })
}