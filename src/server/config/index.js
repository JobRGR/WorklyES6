export default {
  uri: 'mongodb://localhost/worklyES6',
  session: {
    secret: 'someSecret',
    key: 'sid',
    resave: true,
    saveUninitialized: true,
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 1000000
    }
  },
  newrelic: {
    app_name: 'WorklyES6',
    licence_key: '20aa8c30bfb5f3a6e6170676d72be2d5fc647794',
    logging: {
      level: 'trace'
    }
  },
  port: 3333,
  security: {
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    xssProtection: true
  }
}
