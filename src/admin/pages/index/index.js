import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Card from 'material-ui/lib/card/card'
import Tabs from 'material-ui/lib/tabs/tabs'
import Tab from 'material-ui/lib/tabs/tab'
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
