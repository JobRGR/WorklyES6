import wikipedia from 'node-wikipedia'

export default (req, res) => wikipedia
  .page.data(req.query.value, {content: true}, data => {
    let content
    try {
      content = data.text['*']
    }
    catch (err) {
      content = null
    }
    finally {
      res.send({content})
    }
  })
