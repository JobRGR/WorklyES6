import {assert} from 'chai'
import request from 'supertest'

export default (url) => {
  const path = '/api/student'
  let list = []

  describe('student tests', () => {
    it('.get list', (done) => {
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
  })
}