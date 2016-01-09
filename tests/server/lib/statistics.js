import {assert} from 'chai'
import request from 'supertest'
import count from '../helpers/count'
import deleteItem from '../helpers/delete'
import superagent from 'superagent'


export default (url) => {
  const path = '/api/statistics'

  let allCount = 0
  let apiCount = 0
  let apiPartCount = 0

  describe('statistics tests', () => {

    it('.get all', done => {
      request(url)
        .post(`${path}`)
        .send({})
        .expect(200)
        .end((err, res) => {
          assert.property(res.body, 'statistic')
          assert.isAbove(res.body.statistic.length, 0)
          allCount = res.body.statistic.length
          done()
        })
    })

    it('.get some api', done => {
      request(url)
        .post(path)
        .send({name: 'student'})
        .expect(200)
        .end((err, res) => {
          assert.property(res.body, 'statistic')
          assert.isAbove(res.body.statistic.length, 0)
          apiCount = res.body.statistic.length
          done()
        })
    })

    it('.get some api with options', done => {
      request(url)
        .post(path)
        .send({name: 'student', type: 'put', status: 200})
        .expect(200)
        .end((err, res) => {
          assert.property(res.body, 'statistic')
          assert.isAbove(res.body.statistic.length, 0)
          apiPartCount = res.body.statistic.length
          done()
        })
    })

    it('.get percent of some api request to all', done => {
      request(url)
        .post(`${path}/count`)
        .send({name: 'student', type: 'put', status: 200})
        .expect(200)
        .end((err, res) => {
          assert.property(res.body, 'value')
          assert.equal(res.body.value, apiPartCount * 100 / (allCount + 3))
          done()
        })
    })

    it('.get percent of some api request to all api request', done => {
      request(url)
        .post(`${path}/count/type`)
        .send({name: 'student', type: 'put', status: 200})
        .expect(200)
        .end((err, res) => {
          assert.property(res.body, 'value')
          assert.isAbove(res.body.value, apiPartCount * 100 / (apiCount + 4))
          done()
        })
    })

    let checkPie = (body, done) => {
      request(url)
        .post(`${path}/pie`)
        .send(body)
        .expect(200)
        .end((err, res) => {
          assert.hasOwnProperty(res.body, 'pie')
          let {pie} = res.body
          for (let key in pie) {
            assert.hasOwnProperty(pie, key)
            assert.isNumber(pie[key])
            if (body.name && key != 'other') {
              assert.include(body.name, key)
            }
          }
          done()
        })
    }

    it('.get pie all', done => checkPie({}, done))
    it('.get pie all period', done => {
      let max = new Date()
      let min = new Date(max)
      min.setDate(min.getDate() - 10)
      checkPie({date: {min, max}}, done)
    })
    it('.get pie by api', done => {
      let name = ['student', 'company', 'vacancy']
      checkPie({name}, done)
    })
    it('.get pie error all', done => checkPie({error: true}, done))

    let checkGraph = (body, done) => {
      request(url)
        .post(`${path}/graph`)
        .send(body)
        .expect(200)
        .end((err, res) => {
          assert.hasOwnProperty(res.body, 'graph')
          let {graph} = res.body
          assert.hasOwnProperty(graph, 'labels')
          assert.hasOwnProperty(graph, 'series')
          assert.isArray(graph.labels)
          assert.isArray(graph.series)
          assert.equal(graph.series.length, graph.labels.length)
          done()
        })
    }

    it('.get graph', function(done) {
      this.timeout(8000)
      checkGraph({}, done)
    })
    it('.get day graph', function(done) {
      this.timeout(8000)
      checkGraph({type: 'day'}, done)
    })
    it('.get month graph error', function(done) {
      this.timeout(8000)
      checkGraph({type: 'day', error: true}, done)
    })
    it('.get year error graph', function(done) {
      this.timeout(8000)
      checkGraph({type: 'year', error: true}, done)
    })
    it('.get custom api error graph', function(done) {
      this.timeout(8000)
      checkGraph({name: 'student', type: 'month', error: true}, done)
    })
    it('.get custom apis graph', function(done) {
      this.timeout(8000)
      checkGraph({name: ['student', 'company', 'vacancy'], type: 'month'}, done)
    })

    let checkMultiGraph = (body, done) => {
      request(url)
        .post(`${path}/multi-graph`)
        .send(body)
        .expect(200)
        .end((err, res) => {
          assert.hasOwnProperty(res.body, 'graph')
          let {graph} = res.body
          assert.hasOwnProperty(graph, 'labels')
          assert.hasOwnProperty(graph, 'series')
          assert.isArray(graph.labels)
          assert.isArray(graph.series)
          graph.series.forEach(item => {
            assert.isString(item.name)
            assert.isArray(item.data)
          })
          done()
        })
    }

    it('.get multi graph', function(done) {
      this.timeout(8000)
      checkMultiGraph({}, done)
    })

    it('.get multi error graph', function(done) {
      this.timeout(8000)
      checkMultiGraph({error: true}, done)
    })

    it('.get multi error graph by api graph', function(done) {
      this.timeout(8000)
      checkMultiGraph({names: ['student', 'company'], error: true}, done)
    })

    it('.get multi error graph by year', function(done) {
      this.timeout(8000)
      checkMultiGraph({error: true}, done)
    })

    it('.get multi graph by day', function(done) {
      this.timeout(8000)
      checkMultiGraph({}, done)
    })
  })
}
