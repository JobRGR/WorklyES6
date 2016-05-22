import request from '../../client_api/utils/request'

export default (val, cb) => {
  const url = `https://duckduckgo.com/i.js?q=${val}&format=json&pretty=1`
  request({url}).then(result => {
    let image
    try {
      let {data} = result
      if (Array.isArray(data.results)) {
        image = data.results[0].image
      }
    }
    catch (err) {
      image = null
    }
    finally {
      cb(image)
    }
  })
}