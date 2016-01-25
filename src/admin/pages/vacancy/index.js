import React from 'react'
import ReactDOM from 'react-dom'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import VacancyService from '../../service/vacancy'
import Item from './item'

export default React.createClass({
  mixins: [PureRenderMixin],

  render() {
    return (
      <div style={{width: '80%', margin: '40px auto', minWidth: 740, overflow: 'hidden'}}>
          <Item name='vacancy' Api={VacancyService}/>
      </div>
    )
  }
})
