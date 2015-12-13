import {Admin} from '../../models/models'

export default cb => Admin.removeItem(null,
  () => Admin.addItem({name: 'admin', password: 'admin'},
    (err, admin) => {
      console.log(admin)
      cb()
    }))
