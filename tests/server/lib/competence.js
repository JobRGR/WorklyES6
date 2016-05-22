import {assert} from 'chai'
import request from 'supertest'


export default (url) => {
  describe('student error tests', () => {
    it('.serach java', done => {
      request(url)
        .get('/api/competence?value=java')
        .expect(200)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'competence')
          assert.property(res.body.competence, 'image')
          assert.property(res.body.competence, 'title')
          assert.property(res.body.competence, 'text')
          done()
        })
    })
  })
}