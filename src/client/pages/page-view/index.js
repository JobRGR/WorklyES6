import React, {Component} from 'react'
import PageLoader from '../../components/page-loader'


export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {loaded: false, item: null}
  }

  loadItem = (props) => {
    let name = props.route.type
    props.route.api
      .getItem(props.params.id)
      .then(({data}) => {
        if (data.err) throw data.err
        this.setState({item: data[name], loaded: true})
      })
      .catch(err => {
        console.log(err)
        this.setState({item: null, loaded: true})
      })
  }

  componentWillMount() {
    this.loadItem(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({item: null, loaded: false})
    this.loadItem(nextProps)
  }

  render() {
    let childProps = {item: this.state.item}
    return (
      <div>
        {!this.state.loaded && <PageLoader />}
        {this.state.loaded && React.cloneElement(this.props.route.page, childProps)}
      </div>
    )
  }
}