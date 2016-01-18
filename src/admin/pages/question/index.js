import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import CardTitle from 'material-ui/lib/card/card-title'
import Tabs from 'material-ui/lib/tabs/tabs'
import Tab from 'material-ui/lib/tabs/tab'
import QuestionService from '../../service/question'
import Item from './item'

export default React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    return {value: 0}
  },

  handleChange(value) {
    this.setState({value})
  },

  tab(name, Api, index) {
    return (
      <Tab label={name} value={index} key={index} ref='tab'>
        {index == this.state.value && <Item name={name} Api={Api} />}
      </Tab>
    )
  },

  render() {
    return (
      <div style={{width: '80%', margin: '40px auto', minWidth: 740}}>
        <Tabs
          onChange={this.handleChange}
          value={this.state.value}
          inkBarStyle={{backgroundColor: 'rgb(255, 245, 157)'}}>
          {
            [
              {name: 'open-questions', Api: QuestionService.OpenQuestionService},
              {name: 'test-questions', Api: QuestionService.TestQuestionService}
            ].map(({name, Api}, index) => this.tab(name, Api, index))
          }
        </Tabs>
      </div>
    )
  }
})
