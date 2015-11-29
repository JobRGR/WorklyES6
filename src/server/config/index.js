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
  }
}
