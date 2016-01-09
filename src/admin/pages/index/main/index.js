import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ChartistGraph from 'react-chartist'
import StatisticsService from '../../../service/statistics'
import CardHeader from 'material-ui/lib/card/card-header'
import CardText from 'material-ui/lib/card/card-text'
import CardTitle from 'material-ui/lib/card/card-title'
import Loader from '../../../components/loader'

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
      dashboard: StatisticsService.cachedDashboard,
      loading: null,
      error: null
    }
  },

  componentWillUnmount() {
    StatisticsService.removeErrorListener(this.onError)
    StatisticsService.removeLoadingListener(this.onLoading)
    StatisticsService.removeLoadedListener(this.onLoaded)
  },

  componentWillMount() {
    StatisticsService.onError(this.onError)
    StatisticsService.onLoading(this.onLoading)
    StatisticsService.onLoaded(this.onLoaded)
    !this.state.dashboard && StatisticsService.load()
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
        <CardText>
          {graph ? <ChartistGraph data={graph} options={options} type='Line' /> : this.loader(size)}
        </CardText>
      </div>
    )
  },

  pie(pie) {
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
          title='Apis usage'
          titleStyle={subStyle}/>
        <CardText>
          {pie ? <ChartistGraph data={data} type='Bar' option={size} /> : this.loader({width: '100%', height: 150})}
        </CardText>
      </div>
    )
  },

  render() {
    let dashboard = this.state.dashboard || {}
    let options = {low: 0, showArea: true, width: size.width, height: size.height}
    return (
      <div style={{padding: 20}}>
        <CardTitle title='Server Dashboard' titleStyle={{fontSize: 30}} />
        {this.graph('Server info graph', dashboard.graph, options)}
        {this.graph('Apis info graph', dashboard.multiGraph, size)}
        {this.pie(dashboard.pie)}
      </div>
    )
  }
})
