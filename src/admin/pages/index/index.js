import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Card} from 'material-ui/Card'
import {Tabs, Tab} from 'material-ui/Tabs'
import Search from './search'
import Main from './main'

export default React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    return {value: 0}
  },

  handleChange(value) {
    this.setState({value: value})
  },

  render() {
    return (
      <Card style={{
        width: '90%',
        margin: '50px auto'
      }}>
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          inkBarStyle={{backgroundColor: 'rgb(255, 245, 157)'}}
        >
          <Tab label='Server Dashboards' value={0} >
           <Main />
          </Tab>
          <Tab label='Search Logs Data' value={1}>
            <Search />
          </Tab>
        </Tabs>
      </Card>
    )
  }
})
