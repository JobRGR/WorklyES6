import {assert} from 'chai'
import request from 'supertest'
import pluralize from 'pluralize'

export default (url) => {
  const path = `/api/experience`
  const tmpData = {
    name: 'Some experience',
    start: new Date('09-01-2012'),
    end: new Date('07-01-2017'),
    company: 'Some company',
    about: 'Some text'
  }
  const newTmpData = {
    name:'New experience',
    start: new Date('09-01-2011'),
    end: new Date('07-01-2018'),
    company: 'Some new company',
    about: 'Some new text'
  }

  let tmpModel = null
  let list = null

  describe(`experience tests`, () => {
    it('.get list', (done) => {
      request(url)
        .get(path)
        .end((err, res) => {
          list = res.body.experiences || []
          assert.equal(res.status, 200)
          assert.property(res.body, 'experiences')
          done()
        })
    })

    it('.get random item', (done) => {
      const index = parseInt(list.length * Math.random())
      request(url)
        .get(`${path}/${list[index]._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'experience')
          assert.property(res.body.experience, 'name')
          assert.property(res.body.experience, 'start')
          assert.property(res.body.experience, 'end')
          assert.property(res.body.experience, 'about')
          assert.property(res.body.experience, 'company')
          assert.deepEqual(res.body.experience, list[index])
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
      request(url)
        .post(path)
        .send(tmpData)
        .end((err, res) => {
          tmpModel = res.body.experience || {}
          assert.equal(res.status, 200)
          assert.property(res.body, 'experience')
          assert.property(res.body.experience, 'name')
          assert.property(res.body.experience, 'start')
          assert.property(res.body.experience, 'end')
          assert.property(res.body.experience, 'about')
          assert.property(res.body.experience, 'company')
          assert.equal(res.body.experience.name, tmpData.name)
          assert.equal(res.body.experience.start, tmpData.start.toISOString())
          assert.equal(res.body.experience.end, tmpData.end.toISOString())
          assert.equal(res.body.experience.about, tmpData.about)
          assert.equal(res.body.experience.company, tmpData.company)
          done()
        })
    })

    it('.get item', (done) => {
      request(url)
        .get(`${path}/${tmpModel._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'experience')
          assert.property(res.body.experience, 'name')
          assert.deepEqual(res.body.experience, tmpModel)
          done()
        })
    })

    it('.put item', (done) => {
      request(url)
        .put(`${path}/${tmpModel._id}`)
        .send(newTmpData)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'experience')
          assert.property(res.body.experience, 'name')
          assert.property(res.body.experience, 'start')
          assert.property(res.body.experience, 'end')
          assert.property(res.body.experience, 'about')
          assert.property(res.body.experience, 'company')
          assert.equal(res.body.experience.name, newTmpData.name)
          assert.equal(res.body.experience.start, newTmpData.start.toISOString())
          assert.equal(res.body.experience.end, newTmpData.end.toISOString())
          assert.equal(res.body.experience.about, newTmpData.about)
          assert.equal(res.body.experience.company, newTmpData.company)
          assert.equal(res.body.experience._id, tmpModel._id)
          done()
        })
    })

    it('.check put item', (done) => {
      request(url)
        .get(`${path}/${tmpModel._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'experience')
          assert.property(res.body.experience, 'name')
          assert.property(res.body.experience, 'start')
          assert.property(res.body.experience, 'end')
          assert.property(res.body.experience, 'about')
          assert.property(res.body.experience, 'company')
          assert.equal(res.body.experience.name, newTmpData.name)
          assert.equal(res.body.experience.start, newTmpData.start.toISOString())
          assert.equal(res.body.experience.end, newTmpData.end.toISOString())
          assert.equal(res.body.experience.about, newTmpData.about)
          assert.equal(res.body.experience.company, newTmpData.company)
          assert.equal(res.body.experience._id, tmpModel._id)
          done()
        })
    })

    it('.check get count', (done) => {
      request(url)
        .get(`${path}-count`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'count')
          assert.equal(res.body.count, list.length + 1)
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

    it('.autocomplete position', (done) => {
      const index = parseInt(list.length * Math.random())
      const query = list[index].name.split(' ')[0]
      request(url)
        .get(`${path}-autocomplete?position=${query}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'experiences')
          res.body.experiences.forEach(item => assert.include(item.name.toLowerCase(), query.toLowerCase()))
          done()
        })
    })

    it('.search position', (done) => {
      const index = parseInt(list.length * Math.random())
      const query = list[index].name
      request(url)
        .get(`${path}-search?position=${query}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'experience')
          assert.equal(res.body.experience.name, query)
          done()
        })
    })

    it('.autocomplete company', (done) => {
      const index = parseInt(list.length * Math.random())
      const query = list[index].company.split(' ')[0]
      request(url)
        .get(`${path}-autocomplete?company=${query}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'experiences')
          res.body.experiences.forEach(item => assert.include(item.company.toLowerCase(), query.toLowerCase()))
          done()
        })
    })

    it('.search company', (done) => {
      const index = parseInt(list.length * Math.random())
      const query = list[index].company
      request(url)
        .get(`${path}-search?company=${query}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'experience')
          assert.equal(res.body.experience.company, query)
          done()
        })
    })

    it('.random', (done) => {
      request(url)
        .get(`${path}-random`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'experience')
          assert.isString(res.body.experience.name)
          done()
        })
    })
  })
}