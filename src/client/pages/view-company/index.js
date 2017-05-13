import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import {Card, CardHeader} from 'material-ui/Card'
import CircularProgress from 'material-ui/CircularProgress'
import Divider from 'material-ui/Divider'
import Place from 'material-ui/svg-icons/maps/place'
import Email from 'material-ui/svg-icons/communication/email'
import Forward from 'material-ui/svg-icons/content/forward'
import {VacancyService, StudentService, CompanyService} from '../../service/feed'
import {defaultState, count} from '../feed/utils'
import {VacancyApi} from '../../../client_api'

var display = false;


export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      loaded: false,
      search: '',
    }
  }

  componentWillMount() {
    VacancyApi
      .searchItems({companyName: this.props.item.name.name})
      .then(({data}) => {
        if (data.err) throw data.err
        this.setState({loaded: true, items: data.vacancies.slice(0, 10)})
      })
      .catch(err => {
        console.log(err)
        this.setState({loaded: true, items: []})
      })
  }

  navigate = (path) => browserHistory.push(path)

  render() {
    return (
      <div style={{width: '100%'}}>
        <div className='company-image' style={{backgroundImage: `url(${this.props.item.avatar})`}}></div>
        <div className='company-banner'>{this.props.item.name.name}</div>
        <Card className='company-card'>
          <div>
            <div className='view-user_left-side'>
              {
                this.props.item.city &&
                <div className='company-prop'>
                  <Place style={{marginRight: 5}} color={'#00bcd4'}/>
                  <span className='company-prop-label'>{this.props.item.city.name}</span>
                </div>
              }
              <div className='company-prop'>
                <Email style={{marginRight: 5}} color={'#00bcd4'}/>
                <span className='company-prop-label'>{this.props.item.email}</span>
              </div>
              {
                this.props.item.site &&
                <div className='company-prop'>
                  <Forward style={{marginRight: 5}} color={'#00bcd4'}/>
                  <a className='company-prop-label' href={this.props.item.site} style={{color: '#00bcd4'}}>{this.props.item.site}</a>
                </div>
              }
              {
                this.props.item.about &&
                <div className='company-about'>{this.props.item.about}</div>
              }
            </div>
            <div className='view-user_right-side'>

              <CardHeader title={'Вакансії компанії'}
                          titleStyle={{fontFamily: 'sans-serif', fontWeight: 700, fontSize: 18}} />
              <Divider/>
              {
                !this.state.loaded &&
                <div style={{width: '100%', textAlign: 'center', margin: '10px 0'}}>
                  <CircularProgress size={1.5}/>
                </div>
              }
              {
                this.state.loaded &&
                this.state.items
                  .map(item => (
                    <div className='vacancy-item'
                         onClick={() => this.navigate(`/feed/${item._id}`)}>
                      {item.name} - {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  ))
              }

              {
                display &&
                <CardHeader title={'Рекомендована вакансія'}
                            titleStyle={{fontFamily: 'sans-serif', fontWeight: 700, fontSize: 18}} />
              }
              <Divider/>
              {
                display &&
                !this.state.loaded &&
                  <div style={{width: '100%', textAlign: 'center', margin: '10px 0'}}>
                  <CircularProgress size={1.5}/>
                  </div>
              }

              {/*{*/}
                {/*this.state.loaded &&*/}
                {/*this.state.vacancies.data*/}
                    {/*.map(item => (*/}
                      {/*<div className='vacancy-item'*/}
                           {/*onClick={() => this.navigate(`/feed/${item._id}`)}>*/}
                          {/*{item.name}*/}
                      {/*</div>*/}
                    {/*))*/}
              {/*}*/}


              {/*{*/}
                {/*this.state.loaded &&*/}
                {/*this.state.students.data*/}
                    {/*.map(item => (*/}
                        {/*<div className='vacancy-item'*/}
                             {/*onClick={() => this.navigate(`/feed/${item._id}`)}>*/}
                          {/*{item.name}*/}
                        {/*</div>*/}
                    {/*))*/}
              {/*}*/}

          </div>
          </div>
        </Card>
      </div>
    )
  }
}