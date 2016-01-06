import fetch from 'isomorphic-fetch'

export default ({url, method = 'get', body}) => {
  let data = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  }
  if (body) data.body = JSON.stringify(body)
  return fetch(url, data)
    .then(res => res.json()
      .then(json => ({data: json, status: res.status}))
      .catch(err => {
        res.err = err
        return res
      }))
}