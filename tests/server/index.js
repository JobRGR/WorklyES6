import portscanner from 'portscanner'
import config from '../../src/server/config'
import dictionary from './lib/dictionary'
import education from './lib/education'
import experience from './lib/experience'
import student from './lib/student'
import company from './lib/company'
import openQuestion from './lib/open_question'
import testQuestion from './lib/test_question'
import vacancy from './lib/vacancy'
import admin from './lib/admin'
import statistic from './lib/statistics'
import errorStudent from './error/student'
import errorCompany from './error/company'

const {port} = config
const ip = '127.0.0.1'
const url = `${ip}:${port}`

portscanner.checkPortStatus(port, ip, (error, status) => {
  if (status == 'closed') {
    process.env.test = true
    require('../../src/server')
  }
})

const microServices = ['speciality', 'university', 'city', 'skill', 'position', 'company-name']
microServices.forEach(name => dictionary(url, name))

education(url)
experience(url)
student(url)
company(url)
vacancy(url)
errorStudent(url)
errorCompany(url)
testQuestion(url)
openQuestion(url)
admin(url)
statistic(url)
