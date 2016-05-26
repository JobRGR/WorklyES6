import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import {VacancyApi} from '../../../client_api'
import PageLoader from '../page-loader'


export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      items: []
    }
    if (props.type != 'company')
      return browserHistory.push('/feed')
    VacancyApi
      .searchItems({companyName: props.item.name.name})
      .then(({data}) => {
        if (data.err) throw data.err
        this.setState({items: data.vacancies, loaded: true})
      })
      .catch(err => {
        console.log(err)
        this.setState({items: [], loaded: true})
      })
  }

  render() {
    let childProps = {
      items: this.state.items,
      item: this.props.item
    }
    return (
      <div>
        {!this.state.loaded && <PageLoader />}
        {
          this.state.loaded && React.Children.map(this.props.children,
            child => React.cloneElement(child, childProps))
        }
      </div>
    )
  }
}