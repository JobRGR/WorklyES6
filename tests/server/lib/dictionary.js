import {assert} from 'chai'
import request from 'supertest'
import pluralize from 'pluralize'

export default (url, name) => {
  const path = `/api/${name}`
  if (name == 'company-name') {
    name = 'company'
  }
  const tmpData = {name: `Some ${name}`}
  const newTmpData = {name:`New ${name}`}
  const names = pluralize(name, 2)
  let tmpModel = null
  let list = null

  describe(`${name} tests`, () => {
    it('.get list', (done) => {
      request(url)
        .get(path)
        .end((err, res) => {
          list = res.body[names] || []
          assert.equal(res.status, 200)
          assert.property(res.body, names)
          done()
        })
    })

    it('.get random item', (done) => {
      const index = parseInt(list.length * Math.random())
      request(url)
        .get(`${path}/${list[index]._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, name)
          assert.property(res.body[name], 'name')
          assert.equal(res.body[name].name, list[index].name)
          assert.equal(res.body[name]._id, list[index]._id)
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
          tmpModel = res.body[name] || {}
          assert.equal(res.status, 200)
          assert.property(res.body, name)
          assert.property(res.body[name], 'name')
          assert.equal(res.body[name].name, tmpData.name)
          done()
        })
    })

    it('.get item', (done) => {
      request(url)
        .get(`${path}/${tmpModel._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, name)
          assert.property(res.body[name], 'name')
          assert.equal(res.body[name].name, tmpModel.name)
          assert.equal(res.body[name]._id, tmpModel._id)
          done()
        })
    })

    it('.put item', (done) => {
      request(url)
        .put(`${path}/${tmpModel._id}`)
        .send(newTmpData)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, name)
          assert.property(res.body[name], 'name')
          assert.equal(res.body[name].name, newTmpData.name)
          assert.equal(res.body[name]._id, tmpModel._id)
          done()
        })
    })

    it('.check put item', (done) => {
      request(url)
        .get(`${path}/${tmpModel._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, name)
          assert.property(res.body[name], 'name')
          assert.equal(res.body[name].name, newTmpData.name)
          assert.equal(res.body[name]._id, tmpModel._id)
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

    it('.autocomplete', (done) => {
      const index = parseInt(list.length * Math.random())
      const query = list[index].name.split(' ')[0]
      request(url)
        .get(`${path}-autocomplete?${name}=${query}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, names)
          res.body[names].forEach(item => assert.include(item.name.toLowerCase(), query.toLowerCase()))
          done()
        })
    })

    it('.search', (done) => {
      const index = parseInt(list.length * Math.random())
      const query = list[index].name
      request(url)
        .get(`${path}-search?${name}=${query}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, name)
          assert.equal(res.body[name].name, query)
          done()
        })
    })

    it('.random', (done) => {
      request(url)
        .get(`${path}-random`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, name)
          assert.isString(res.body[name].name)
          done()
        })
    })
  })
}