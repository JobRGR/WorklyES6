import {assert} from 'chai'
import request from 'supertest'

export default (url) => {
  const path = '/api/experience'
  let tmpData = {start: new Date('09-01-2012'), end: new Date('07-01-2017')}
  let newTmpData = {start: new Date('09-01-2011'), end: new Date('07-01-2018')}

  let newData = {
    start: new Date('09-01-2012'), end: new Date('07-01-2017'),
    company: 'Google', position: 'Data Analyst'
  }

  let editNewData = {
    start: new Date('01-01-2012'), end: new Date('01-01-2017'),
    company: 'Google', position: 'Data Analyst'
  }

  let newDataReturn = {}
  let newcompany = null
  let newposition = null

  let tmpModel = null
  let list = null

  describe('experience tests', () => {
    it('.get list', (done) => {
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

    it('.get random item', (done) => {
      const index = Math.floor(list.length * Math.random())
      request(url)
        .get(`${path}/${list[index]._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'experience')
          assert.property(res.body.experience, 'start')
          assert.property(res.body.experience, 'end')
          assert.property(res.body.experience, 'position')
          assert.property(res.body.experience, 'company')
          assert.equal(res.body.experience.start, list[index].start)
          assert.equal(res.body.experience.end, list[index].end)
          assert.equal(res.body.experience._id, list[index]._id)
          assert.isObject(res.body.experience.position)
          assert.isObject(res.body.experience.company)
          assert.deepEqual(res.body.experience.position, list[index].position)
          assert.deepEqual(res.body.experience.company, list[index].company)
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
      const index = Math.floor(list.length * Math.random())
      tmpData.position = list[index].position._id
      tmpData.company = list[index].company._id
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
          assert.property(res.body.experience, 'company')
          assert.equal(res.body.experience.start, tmpData.start.toISOString())
          assert.equal(res.body.experience.end, tmpData.end.toISOString())
          assert.equal(res.body.experience.position, tmpData.position)
          assert.equal(res.body.experience.company, tmpData.company)
          done()
        }))
    })

    it('.check set', (done) => {
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
      const index = Math.floor(list.length * Math.random())
      newTmpData.position = list[index].position._id
      newTmpData.company = list[index].company._id
      request(url)
        .put(`${path}/${tmpModel._id}`)
        .send(newTmpData)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'experience')
          assert.property(res.body.experience, 'start')
          assert.property(res.body.experience, 'end')
          assert.property(res.body.experience, 'position')
          assert.property(res.body.experience, 'company')
          assert.equal(res.body.experience.start, newTmpData.start.toISOString())
          assert.equal(res.body.experience.end, newTmpData.end.toISOString())
          assert.equal(res.body.experience.position, newTmpData.position)
          assert.equal(res.body.experience.company, newTmpData.company)
          done()
        })
    })

    it('.check put item', (done) => {
      request(url)
        .get(`${path}/${tmpModel._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'experience')
          assert.property(res.body.experience, 'start')
          assert.property(res.body.experience, 'end')
          assert.property(res.body.experience, 'position')
          assert.property(res.body.experience, 'company')
          assert.equal(res.body.experience.start, newTmpData.start.toISOString())
          assert.equal(res.body.experience.end, newTmpData.end.toISOString())
          assert.isObject(res.body.experience.position)
          assert.isObject(res.body.experience.company)
          assert.equal(res.body.experience.position._id, newTmpData.position)
          assert.equal(res.body.experience.company._id, newTmpData.company)
          done()
        })
    })

    it('.delete item', (done) => {
      request(url)
        .delete(`${path}/${tmpModel._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'ok')
          done()
        })
    })

    it('.check get delete', (done) => {
      request(url)
        .get(`${path}-count`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'count')
          assert.equal(res.body.count, list.length)
          done()
        })
    })

    it('.random', (done) => {
      request(url)
        .get(`${path}-random`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'experience')
          assert.property(res.body.experience, 'start')
          assert.property(res.body.experience, 'end')
          assert.property(res.body.experience, 'position')
          assert.property(res.body.experience, 'company')
          assert.isString(res.body.experience.start)
          assert.isString(res.body.experience.end)
          assert.isObject(res.body.experience.position)
          assert.isObject(res.body.experience.company)
          done()
        })
    })


    it('.add new item', (done) => {
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
          assert.property(res.body.experience, 'company')
          assert.equal(res.body.experience.start, newData.start.toISOString())
          assert.equal(res.body.experience.end, newData.end.toISOString())
          done()
        }))
    })

    it('.check add new item', (done) => {
      request(url)
        .get(`${path}/${newDataReturn._id}`)
        .end((err, res) => {
          newposition = res.body.experience.position || null
          newcompany = res.body.experience.company || null
          assert.equal(res.status, 200)
          assert.property(res.body, 'experience')
          assert.property(res.body.experience, 'start')
          assert.property(res.body.experience, 'end')
          assert.property(res.body.experience, 'position')
          assert.property(res.body.experience, 'company')
          assert.equal(res.body.experience.start, newData.start.toISOString())
          assert.equal(res.body.experience.end, newData.end.toISOString())
          assert.isObject(res.body.experience.position)
          assert.isObject(res.body.experience.company)
          assert.equal(res.body.experience.position._id, newDataReturn.position)
          assert.equal(res.body.experience.company._id, newDataReturn.company)
          done()
        })
    })

    it('.put new item', (done) => {
      request(url)
        .put(`${path}-update/${newDataReturn._id}`)
        .send(editNewData)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'experience')
          assert.property(res.body.experience, 'start')
          assert.property(res.body.experience, 'end')
          assert.property(res.body.experience, 'position')
          assert.property(res.body.experience, 'company')
          assert.equal(res.body.experience.start, editNewData.start.toISOString())
          assert.equal(res.body.experience.end, editNewData.end.toISOString())
          assert.equal(res.body.experience.position._id, newDataReturn.position._id)
          assert.equal(res.body.experience.company._id, newDataReturn.company._id)
          done()
        })
    })

    it('.delete item', (done) => {
      request(url)
        .delete(`${path}/${newDataReturn._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'ok')
          done()
        })
    })

    it('.get new company', (done) => {
      request(url)
        .get(`/api/company-name/${newcompany._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'company')
          assert.property(res.body.company, 'name')
          assert.equal(res.body.company.name, newData.company)
          assert.equal(res.body.company._id, newcompany._id)
          done()
        })
    })

    it('.delete new company', (done) => {
      request(url)
        .delete(`/api/company-name/${newcompany._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'ok')
          done()
        })
    })

    it('.get new position', (done) => {
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

    it('.delete new position', (done) => {
      request(url)
        .delete(`/api/position/${newposition._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'ok')
          done()
        })
    })
  })
}