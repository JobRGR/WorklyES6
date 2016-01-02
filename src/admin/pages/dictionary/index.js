import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Card from 'material-ui/lib/card/card'
import CardTitle from 'material-ui/lib/card/card-title'
import Tabs from 'material-ui/lib/tabs/tabs'
import Tab from 'material-ui/lib/tabs/tab'
import DictionaryService from '../../service/dicitionary'
import List from './list'

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
      <Tab label={name} value={index} key={index} >
        {index == this.state.value && <List name={name} Api={Api} />}
      </Tab>
    )
  },

  render() {
    return (
      <Card style={{width: '80%', margin: '40px auto'}}>
        <CardTitle title='Dictionary dashboard' />
        <Tabs
          onChange={this.handleChange}
          value={this.state.value}
          inkBarStyle={{backgroundColor: 'rgb(255, 245, 157)'}}
        >
          {
            [
              {name: 'City', Api: DictionaryService.CityService},
              {name: 'Skill', Api: DictionaryService.SkillService},
              {name: 'Company Name', Api: DictionaryService.CompanyNameService},
              {name: 'Position', Api: DictionaryService.PositionService},
              {name: 'Speciality', Api: DictionaryService.SpecialityService},
              {name: 'University', Api: DictionaryService.UniversityService}
            ].map(({name, Api}, index) => this.tab(name, Api, index))
          }
        </Tabs>
      </Card>
    )
  }
})
