import fs from 'fs'
import path from 'path'

export default (file) => {
  let json = JSON.stringify(fs
    .readFileSync(path.resolve(__dirname, file), 'utf8')
    .split('\n')
    .sort()
    .filter(item => item.trim().length > 0)
    .reduce((res, item) => {
      res.indexOf(item) < 0 && res.push(item)
      return res
    }, []))

  fs.writeFile(path.resolve(__dirname, 'res.json'), json, 'utf8', () => console.log(json))
}
