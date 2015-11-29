import portscanner from 'portscanner'
import dictionary from './lib/dictionary'
import education from './lib/education'
import experience from './lib/experience'
import student from './lib/student'
import openQuestion from './lib/open_question'

const port = 3333
const ip = '127.0.0.1'
const url = `${ip}:${port}`

portscanner.checkPortStatus(port, ip, (error, status) => {
  (status == 'closed') && require('../../src/server')
})

const microServices = ['speciality', 'university', 'city', 'skill', 'position', 'company-name']
microServices.forEach(name => dictionary(url, name))

education(url)
experience(url)
student(url)
openQuestion(url)