import {assert} from 'chai'
import request from 'supertest'

export default (url, path, expected, done) => {
  request(url)
    .get(`${path}-count`)
    .end((err, res) => {
      console.log(res.body, expected)
      assert.equal(res.status, 200)
      assert.property(res.body, 'count')
      assert.equal(res.body.count, expected)
      done()
    })
}