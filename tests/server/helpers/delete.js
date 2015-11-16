import {assert} from 'chai'
import request from 'supertest'

export default (url, path, done) => {
  request(url)
    .delete(path)
    .end((err, res) => {
      assert.equal(res.status, 200)
      assert.property(res.body, 'ok')
      done()
    })
}