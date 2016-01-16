import React from 'react'
import ReactDOM from 'react-dom'
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
    return {
      value: 0,
      initTop: 0
    }
  },

  handleChange(value) {
    this.setState({value})
  },

  componentDidMount() {
    this.setState({
      initTop: ReactDOM.findDOMNode(this).offsetTop + ReactDOM.findDOMNode(this.refs.tab).offsetHeight
    })
  },

  tab(name, Api, index) {
    return (
      <Tab label={name} value={index} key={index} ref='tab' >
        {index == this.state.value && <Item name={name} Api={Api} initTop={this.state.initTop}/>}
      </Tab>
    )
  },
  render() {
    return (
      <div style={{width: '80%', margin: '40px auto', minWidth: 740}}>
        <Tabs
          onChange={this.handleChange}
          value={this.state.value}
          inkBarStyle={{backgroundColor: 'rgb(255, 245, 157)'}}
        >
          {
            [
              {name: 'company', Api: UserService.CompanyService},
              {name: 'student', Api: UserService.StudentService},
            ].map(({name, Api}, index) => this.tab(name, Api, index))
          }
        </Tabs>
      </div>
    )
  }
})