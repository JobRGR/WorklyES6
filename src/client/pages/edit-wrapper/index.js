import React, {Component} from 'react'
import EditStudent from '../edit-student'
import EditCompany from '../edit-company'


export default class extends Component {
  render() {
    if (!this.props.type) return false
    return (
      this.props.type == 'student'
      ? <EditStudent item={this.props.item}/>
      : <EditCompany item={this.props.item}/>
    )
  }
}