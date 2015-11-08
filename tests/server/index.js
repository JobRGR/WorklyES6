import speciality from './lib/speciality'
import university from './lib/university'
import portscanner from 'portscanner'

portscanner.checkPortStatus(3333, '127.0.0.1', (error, status) => {
  if (status == 'closed')  {
    require('../../src/server')
  }
})

const url = 'http://localhost:3333'

speciality(url)
university(url)
