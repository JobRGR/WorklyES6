export default {
  app: (req, res, next) => res.render(`${__dirname}/../../../dist/client/index.html`),
  admin: (req, res, next) => res.render(`${__dirname}/../../../dist/admin/index.html`)
}

