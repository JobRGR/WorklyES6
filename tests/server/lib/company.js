import {assert} from 'chai'
import request from 'supertest'
import count from '../helpers/count'
import deleteItem from '../helpers/delete'
import superagent from 'superagent'
let agent = superagent.agent()

export default (url) => {
  const path = '/api/company'
  let list = []

  let tmpCompany = {name: 'InsSolutions', password: '1111', email: 'ins_solutins@somnia.com'}
  let tmpModel = null

  describe('company tests', () => {
    let getSession = done => {
      let req = request(url)
        .get(`${path}-status`)
      agent.attachCookies(req)

      req.end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'company')
        assert.property(res.body.company, 'name')
        assert.equal(res.body.company.name.name, tmpCompany.name)
        assert.equal(res.body.company.email, tmpCompany.email)
        assert.notProperty(res.body.company, 'salt')
        assert.notProperty(res.body.company, 'hashedPassword')
        done()
      })
    }

    let checkLogin = () => {
      it('.login company', done => {
        request(url)
          .post(`${path}-login`)
          .send(tmpCompany)
          .end((err, res) => {
            agent.saveCookies(res)
            assert.equal(res.status, 200)
            assert.property(res.body, 'company')
            assert.property(res.body.company, 'name')
            assert.equal(res.body.company.name.name, tmpCompany.name)
            assert.equal(res.body.company.email, tmpCompany.email)
            assert.notProperty(res.body.company, 'salt')
            assert.notProperty(res.body.company, 'hashedPassword')
            done()
          })
      })

      it('.get session login company', getSession)
    }

    it('.get list', done => {
      request(url)
        .get(path)
        .end((err, res) => {
          list = res.body.companies || []
          assert.equal(res.status, 200)
          assert.property(res.body, 'companies')
          assert.isAbove(res.body.companies.length, 0)
          done()
        })
    })

    it('.get item by id', done => {
      const index = Math.floor(list.length * Math.random())
      request(url)
        .get(`${path}/${list[index]._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'company')
          assert.property(res.body.company, 'site')
          assert.property(res.body.company, 'email')
          assert.property(res.body.company, 'name')
          assert.property(res.body.company, 'createdAt')
          assert.property(res.body.company, 'updatedAt')
          assert.property(res.body.company, 'about')
          assert.property(res.body.company, 'city')
          assert.equal(res.body.company.site, list[index].site)
          assert.equal(res.body.company.about, list[index].about)
          assert.equal(res.body.company.email, list[index].email)
          assert.equal(res.body.company._id, list[index]._id)
          assert.isObject(res.body.company.city)
          assert.isObject(res.body.company.name)
          assert.deepEqual(res.body.company.name, list[index].name)
          assert.deepEqual(res.body.company.city, list[index].city)
          assert.notProperty(res.body.company, 'salt')
          assert.notProperty(res.body.company, 'hashedPassword')
          done()
        })
    })

    it('.get count', done => count(url, path, list.length, done))

    it('.set new company', done => {
      request(url)
        .post(path)
        .send(tmpCompany)
        .end((err, res) => {
          tmpModel = res.body.company || {}
          agent.saveCookies(res)
          assert.equal(res.status, 200)
          assert.property(res.body, 'company')
          assert.property(res.body.company, 'name')
          assert.equal(res.body.company.email, tmpCompany.email)
          assert.notProperty(res.body.company, 'salt')
          assert.notProperty(res.body.company, 'hashedPassword')
          done()
        })
    })

    it('.check set company', done => count(url, path, list.length + 1, done))

    it('.get new company', done => {
      request(url)
        .get(`${path}/${tmpModel._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'company')
          assert.property(res.body.company, 'name')
          assert.equal(res.body.company.name.name, tmpCompany.name)
          assert.equal(res.body.company.email, tmpCompany.email)
          assert.notProperty(res.body.company, 'salt')
          assert.notProperty(res.body.company, 'hashedPassword')
          done()
        })
    })

    it('.get session set company', getSession)

    checkLogin()

    it('.change my password', done => {
      tmpCompany.password = '2222'
      let req = request(url).put(`${path}-password`)
      agent.attachCookies(req)
      req.send({password: tmpCompany.password})
      req.end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'ok')
        done()
      })
    })

    checkLogin()

    it('.change password', done => {
      tmpCompany.password = '111'
      request(url)
        .put(`${path}-password/${tmpModel._id}`)
        .send({password: tmpCompany.password})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'ok')
          done()
        })
    })

    checkLogin()

    it('.change my email', done => {
      tmpCompany.email = 'ins_solutins2@somnia.com'
      request(url)
        .put(`${path}-email/${tmpModel._id}`)
        .send({email: tmpCompany.email})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'ok')
          done()
        })
    })

    checkLogin()

    it('.change email', done => {
      tmpCompany.email = 'ins_solutins@somnia.com'
      request(url)
        .put(`${path}-email/${tmpModel._id}`)
        .send({email: tmpCompany.email})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'ok')
          done()
        })
    })

    it('.get check change email', done => {
      request(url)
        .get(`${path}/${tmpModel._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'company')
          assert.property(res.body.company, 'name')
          assert.equal(res.body.company.name.name, tmpCompany.name)
          assert.equal(res.body.company.email, tmpCompany.email)
          assert.notProperty(res.body.company, 'salt')
          assert.notProperty(res.body.company, 'hashedPassword')
          done()
        })
    })

    it('.delete item', done => deleteItem(url, `${path}/${tmpModel._id}`, done))

    it('.check get delete', done => count(url, path, list.length, done))

    it('.search by city', done => {
      const city = list[Math.floor(list.length * Math.random())].city.name
      request(url)
        .post(`${path}-search`)
        .send({city})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'companies')
          assert.isAbove(res.body.companies.length, 0);
          res.body.companies.forEach((item) => assert.equal(item.city.name, city))
          done()
        })
    })

    it('.search by email', done => {
      const someCompany = list[Math.floor(list.length * Math.random())]
      const {email} = someCompany
      request(url)
        .post(`${path}-search`)
        .send({email})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'companies')
          assert.isAbove(res.body.companies.length, 0)
          res.body.companies.forEach((item) => {
            assert.equal(item.email, email)
          })
          done()
        })
    })

    it('.search by name', done => {
      const someCompany = list[Math.floor(list.length * Math.random())]
      const companyName = someCompany.name.name
      request(url)
        .post(`${path}-search`)
        .send({companyName})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'companies')
          assert.isAbove(res.body.companies.length, 0)
          res.body.companies.forEach((item) => {
            assert.property(item, 'name')
            assert.equal(item.name.name, companyName)
          })
          done()
        })
    })

    it('.search by name and email', done => {
      const someCompany = list[Math.floor(list.length * Math.random())]
      const email = someCompany.email,
            companyName = someCompany.name.name
      request(url)
        .post(`${path}-search`)
        .send({companyName, email})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'companies')
          assert.isAbove(res.body.companies.length, 0)
          res.body.companies.forEach((item) => {
            assert.property(item, 'name')
            assert.equal(item.name.name, companyName)
            assert.equal(item.email, email)
          })
          done()
        })
    })

    it('.search by name and city', done => {
      const someCompany = list[Math.floor(list.length * Math.random())]
      const companyName = someCompany.name.name,
            city = someCompany.city.name
      request(url)
        .post(`${path}-search`)
        .send({companyName, city})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'companies')
          assert.isAbove(res.body.companies.length, 0)
          res.body.companies.forEach((item) => {
            assert.property(item, 'name')
            assert.property(item, 'city')
            assert.equal(item.name.name, companyName)
            assert.equal(item.city.name, city)
          })
          done()
        })
    })

    it('.search by name, city and email', done => {
      const someCompany = list[Math.floor(list.length * Math.random())]
      const companyName = someCompany.name.name,
            city = someCompany.city.name,
            email = someCompany.email
      request(url)
        .post(`${path}-search`)
        .send({companyName, city, email})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.property(res.body, 'companies')
          assert.isAbove(res.body.companies.length, 0)
          res.body.companies.forEach((item) => {
            assert.property(item, 'name')
            assert.property(item, 'city')
            assert.equal(item.name.name, companyName)
            assert.equal(item.city.name, city)
            assert.equal(item.email, email)
          })
          done()
        })
    })

  })
}
