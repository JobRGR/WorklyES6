import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ChartistGraph from 'react-chartist'
import StatisticService from '../../../service/statistic'
import {CardHeader, CardTitle, CardActions} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../../../components/loader'
import capitalize from '../../../tools/capitalize'


const size = {
  width: '100%',
  height: 500
}

const subStyle = {
  fontSize: 16,
  color: 'rgba(0, 0, 0, 0.54)',
  display: 'block',
  margin: '20px 0'
}

export default React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      dashboard: StatisticService.cachedDashboard,
      loading: null,
      error: null,
      type: StatisticService.type
    }
  },

  componentWillUnmount() {
    StatisticService.removeErrorListener(this.onError)
    StatisticService.removeLoadingListener(this.onLoading)
    StatisticService.removeLoadedListener(this.onLoaded)
  },

  componentWillMount() {
    StatisticService.onError(this.onError)
    StatisticService.onLoading(this.onLoading)
    StatisticService.onLoaded(this.onLoaded)
    !this.state.dashboard && StatisticService.load()
  },

  onError(error) {
    this.setState({error, loading: false})
  },

  onLoaded(dashboard) {
    console.log(dashboard)
    this.setState({dashboard, loading: false})
  },

  onLoading() {
    this.setState({loading: true})
  },

  handleType(type) {
    this.setState({type, dashboard: null})
    StatisticService.setType(type)
  },

  loader(style) {
    return (
      <div style={style}>
        <Loader />
      </div>
    )
  },

  graph(title, graph, options) {
    return (
      <div>
        <CardHeader
          title={title}
          titleStyle={subStyle} />
        {graph ? <ChartistGraph data={graph} options={options} type='Line' /> : this.loader(size)}
      </div>
    )
  },

  pie(title, pie) {
    let data = {labels: [], series: [[]]}
    if (pie) {
      for (let key in pie) {
        data.labels.push(key)
        data.series[0].push(pie[key])
      }
    }
    return (
      <div>
        <CardHeader
          title={title}
          titleStyle={subStyle}/>
        {pie ? <ChartistGraph data={data} type='Bar' option={size} /> : this.loader({width: '100%', height: 150})}
      </div>
    )
  },

  render() {
    const types = ['day', 'month', 'year']
    let dashboard = this.state.dashboard || {}
    let options = {low: 0, showArea: true, width: size.width, height: size.height}
    return (
      <div>
        <CardTitle title='Server Dashboard' titleStyle={{fontSize: 30}} />
        <CardActions>
          {
            types.map(type => <FlatButton
              key={type}
              label={capitalize(type)}
              disabled={type == this.state.type}
              primary
              onTouchTap={() => type != this.state.type && this.handleType(type)}
            />)
          }
        </CardActions>
        {this.graph('Server info graph', dashboard.graph, options)}
        {this.graph('Apis info graph', dashboard.multiGraph, size)}
        {this.pie('Apis usage', dashboard.pie)}
        {this.pie('Error in apis', dashboard.errorPie)}
      </div>
    )
  }
})
