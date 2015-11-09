import portscanner from 'portscanner'
import service from './lib/service'

portscanner.checkPortStatus(3333, '127.0.0.1', (error, status) => {
  if (status == 'closed')  {
    require('../../src/server')
  }
})

const url = 'http://localhost:3333'

const microServices = ['speciality', 'university', 'city', 'skill']
microServices.forEach(name => service(url, name))
