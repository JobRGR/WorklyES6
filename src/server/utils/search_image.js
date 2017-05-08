const cheerio = require('cheerio')
const fetch = require('isomorphic-fetch')

export default (val, cb) => {
  const getPage = url =>
    fetch(url)
      .then(response => response.text())
      .then(body => cheerio.load(body));

  const getImages = query => {
    const url = `https://www.google.com/search?tbm=isch&q=${query}`;
    const imageList = [];
    return getPage(url)
      .then($ => {
        return $('#ires').find('a img')
      })
      .then(images => {
        return images.each((index, image) => imageList.push(image.attribs.src))
      })
      .then(() => imageList)
  }

  getImages(val + ' logo').then(x => cb(x[0]))
}
