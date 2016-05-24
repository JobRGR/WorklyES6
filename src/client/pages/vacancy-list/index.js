import React, {Component} from 'react'


export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {items: JSON.parse(JSON.stringify(props.items))}
  }

  render() {
    console.log(this.state.items)
    return (
      <div>
        Тут вакансии компании с возможностью редактировки и тд(личный кабинет компании)
        {
          this.state.items.map(item => (<div>{item.name}</div>))
        }
      </div>
    )
  }
}