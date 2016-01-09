import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Card from 'material-ui/lib/card/card'
import CardTitle from 'material-ui/lib/card/card-title'
import Tabs from 'material-ui/lib/tabs/tabs'
import Tab from 'material-ui/lib/tabs/tab'
import UserService from '../../service/user'
import Item from './item'

export default React.createClass({
  mixins: [PureRenderMixin],



  getInitialState() {
    return {value: 0}
  },

  handleChange(value) {
    this.setState({value})
  },

  render() {
    return (
      <div style={{width: '80%', margin: '40px auto', minWidth: 740}}>
        <Item name='company' Api={UserService.CompanyService}/>
      </div>
    )
  }
})
