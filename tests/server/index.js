import portscanner from 'portscanner'
import service from './lib/service'
import education from './lib/education'

const port = 3333
const ip = '127.0.0.1'
const url = `${ip}:${port}`

portscanner.checkPortStatus(port, ip, (error, status) => {
  if (status == 'closed')  {
    require('../../src/server')
  }
})

const microServices = ['speciality', 'university', 'city', 'skill']
microServices.forEach(name => service(url, name))

education(url)