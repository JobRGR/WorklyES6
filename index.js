const cheerio = require('cheerio');
const fetch = require('isomorphic-fetch');

const getPage = url =>
  fetch(url)
    .then(response => response.text())
    .then(body => cheerio.load(body));

const getImages = query => {
  const url = `https://www.google.com/search?tbm=isch&q=${query}`;
  const imageList = [];
  return getPage(url)
    .then($ => {
      $('#ires').find('a img')
    })
    .then(images => {
      images.each((index, image) => imageList.push(image.attribs.src))
    })
    .then(() => imageList)
}

getImages('ciklum').then(x => console.log(x))
