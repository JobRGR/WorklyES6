import React, {Component} from 'react'
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import Divider from 'material-ui/Divider'
import AvatarName from '../../components/avatar-name'
import dateFormat from 'dateformat'
import getResume from '../../tools/get-resume'


const buttonStyle = {
  textTransform: 'none',
  fontFamily: 'sans-serif',
  fontSize: 18
}

export default class extends Component {
  render() {
    const telephone = (this.props.item.telephone || '')
      .replace(/[^0-9]/g, '')

    return (
      <Card className='view-user'>
        <div className='view-user_left-side'>
          <AvatarName src={this.props.item.avatar}
                      name={this.props.item.name}
                      city={this.props.item.city && this.props.item.city.name}
                      dob={this.props.item.dob} />
          {
            this.props.item.about &&
            <div className='student-about'>{this.props.item.about}</div>
          }
          {
            this.props.item.educations.length && [
              <div className='student-subtitle'>Освіта</div>,
              <Divider/>,
              ...this.props.item.educations.map(education => [
                <div key={education._id} className='student-item'>
                  <div className='student-list-title'>{education.speciality.name}</div>
                  <div className='student-list-speciality'>{education.university.name}</div>
                  <div className='student-dates'>
                    {education.start && <span>з {dateFormat(new Date(education.start), "mmmm dS, yyyy")}</span>}
                    {education.end && <span> по {dateFormat(new Date(education.end), "mmmm dS, yyyy")}</span>}
                  </div>
                </div>,
                <Divider/>
              ])
            ]
          }
          {
            this.props.item.experiences.length && [
              <div className='student-subtitle'>Досвід роботи</div>,
              <Divider/>,
              ...this.props.item.experiences.map(experience => [
                <div key={experience._id} className='student-item'>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div className='student-list-title'>{experience.position.name}</div>
                  </div>
                  <div className='student-dates'>
                    <span style={{fontStyle: 'italic'}}>{experience.companyName.name}</span>
                    {' | '}
                    {experience.start && <span>з {new Date(experience.start).toLocaleDateString()}</span>}
                    {experience.end && <span> по {new Date(experience.end).toLocaleDateString()}</span>}
                  </div>
                  <div style={{marginTop: 5}} className='student-list-about'>{experience.about}</div>
                </div>,
                <Divider/>
              ])
            ]
          }
        </div>
        <div className='view-user_right-side'>
          {
            this.props.item.skills.length > 0 &&
            <div className='skill-wrapper'>
              {
                this.props.item.skills.map((skill) => (
                  <div key={skill._id} className='skill-item'>{skill.name}</div>
                ))
              }
            </div>
          }
          <Card>
            <CardHeader
              title={'Зв\'язатись з кандидатом'}
              titleStyle={{fontFamily: 'sans-serif', fontWeight: 700, fontSize: 18}}
              actAsExpander={true}
              showExpandableButton={true}
            />
            <Divider/>
            <CardActions expandable={true}>
              <FlatButton label='Завантажити резюме'
                          style={{width: '100%', marginBottom: 8}}
                          labelStyle={buttonStyle}
                          labelClassName='action-button-label'
                          onClick={() => getResume(this.props.item)} />
              <Divider/>
              {telephone && [
                <FlatButton label='Зателефонувати'
                            style={{width: '100%', marginTop: 8}}
                            labelStyle={buttonStyle}
                            labelClassName='action-button-label'
                            linkButton={true}
                            href={`tel:${this.props.item.telephone}`} />,
                <Divider/>
              ]}
              <FlatButton label='Написати електроного листа'
                          style={{width: '100%', marginTop: 8}}
                          labelStyle={buttonStyle}
                          linkButton={true}
                          href={`mailto::${this.props.item.email}`} />
            </CardActions>
          </Card>
        </div>
      </Card>
    )
  }
}
