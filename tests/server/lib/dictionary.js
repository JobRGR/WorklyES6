import {assert} from 'chai'
import request from 'supertest'
import pluralize from 'pluralize'
import count from '../helpers/count'
import deleteItem from '../helpers/delete'


export default (url, name) => {
  const path = `/api/${name}`
  if (name == 'company-name')
    name = 'companyName'
  const tmpData = {name: `Some ${name}`}
  const newTmpData = {name:`New ${name}`}
  const newTmpArray = [`Some ${name}`, `New ${name}`]
  const names = pluralize(name, 2)
  let tmpModel = null
  let tmpArrayList = null
  let list = null

  describe(`${name} tests`, () => {
    it('.get list', done => {
      request(url)
        .get(path)
        .end((err, res) => {
          list = res.body[names] || []
          assert.equal(res.status, 200)
          assert.property(res.body, names)
          done()
        })
    })

    it('.get random item', done => {
      const index = Math.floor(list.length * Math.random())
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

    it('.get count', done => count(url, path, list.length, done))

    it('.set item', done => {
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

    it('.get item', done => {
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

    it('.put item', done => {
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

    it('.check put item', done => {
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

    it('.check get count', done => count(url, path, list.length + 1, done))

    it('.delete item', done => deleteItem(url, `${path}/${tmpModel._id}`, done))

    it('.check get delete', done => count(url, path, list.length, done))

    xit('.autocomplete', done => {
      const index = Math.floor(list.length * Math.random())
      const query = list[index].name.split(' ')[0]
      request(url)
        .get(`${path}-autocomplete?${name}=${query}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, names)
          //res.body[names].forEach(item => assert.include(item.name.toLowerCase(), query.toLowerCase()))
          done()
        })
    })

    xit('.search', done => {
      const index = Math.floor(list.length * Math.random())
      const query = list[index].name
      request(url)
        .get(`${path}-search?${name}=${query}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, names)
          res.body[names].length &&
          assert.isTrue(res.body[names][0].name.indexOf(query) > -1 || query.indexOf(res.body[names][0]) > -1)
          done()
        })
    })

    it('.random', done => {
      request(url)
        .get(`${path}-random`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, name)
          assert.isString(res.body[name].name)
          done()
        })
    })

    it('.add items', done => {
      request(url)
        .post(`${path}s-add`)
        .send({[names]: newTmpArray})
        .end((err, res) => {
          tmpArrayList = res.body[names] || []
          assert.equal(res.status, 200)
          assert.property(res.body, names)
          res.body[names].forEach((item, index) => assert.equal(item.name, newTmpArray[index]))
          done()
        })
    })

    it('.check add items - get count', done => count(url, path, list.length + 2, done))

    it('.remove items', done => {
      request(url)
        .delete(`${path}s-remove`)
        .send({[names]: tmpArrayList.map(({_id}) => _id)})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'ok')
          done()
        })
    })

    it('.check remove items - get count', done => count(url, path, list.length, done))
    
  })
}
