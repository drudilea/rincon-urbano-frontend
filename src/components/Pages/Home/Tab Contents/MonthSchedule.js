import React, { Component } from 'react'
import ReactLoading from 'react-loading'

import { withFirebase } from '../../../Firebase'
import { getTeachersQuery } from '../../../Firebase/Queries/users'
import { getMonthStreamsQuery } from '../../../Firebase/Queries/streams'
import WeekSchedule from './WeekSchedule'
import './monthSchedule.scss'
import {
  assignStreamTeacherProps,
  separateStreamsByWeek,
} from '../../../../utils/streams'

class MonthScheduleBase extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      displayWeekStreams: null,
    }
  }

  // Cuando cargo la pag traemos toda la info de la tabla streams en firebase y la "mapeamos" en usersList
  async componentDidMount() {
    this.setState({ loading: true })

    const teachersResponse = await getTeachersQuery()
    if (teachersResponse.status === 200)
      this.setState({ teachers: teachersResponse.data })
    else {
      console.log('Error fetching Teachers ROLES DB ', teachersResponse.message)
      this.setState({ error: teachersResponse.message })
    }

    // prettier-ignore
    const { status: streamsQueryStatus, monthStreams, message: streamsQueryMessage } = await getMonthStreamsQuery()
    if (streamsQueryStatus === 200) this.setState({ monthStreams })
    else this.setState({ error: streamsQueryMessage })

    const displayWeekStreams = assignStreamTeacherProps(
      this.state.teachers,
      this.state.monthStreams,
    )

    const streamsPerWeek = separateStreamsByWeek(displayWeekStreams)
    const firstWeekStreams = streamsPerWeek[0]
    const secondWeekStreams = streamsPerWeek[1]
    const thirdWeekStreams = streamsPerWeek[2]
    const fourthWeekStreams = streamsPerWeek[3]

    this.setState({
      displayWeekStreams,
      loading: false,
      firstWeekStreams,
      secondWeekStreams,
      thirdWeekStreams,
      fourthWeekStreams,
    })
  }

  render() {
    const {
      displayWeekStreams,
      loading,
      firstWeekStreams,
      secondWeekStreams,
      thirdWeekStreams,
      fourthWeekStreams,
    } = this.state

    return (
      <div className='week-schedule-container'>
        {loading && (
          <div className='loading'>
            <ReactLoading
              type={'spin'}
              color={'#fff'}
              height={'50px'}
              width={'50px'}
            />
          </div>
        )}
        {!loading && displayWeekStreams === null && (
          <div className='no-streams'>
            <p>
              Todavía no hay clases habilitadas para estas semanas, volvé a
              intentarlo en otro momento.
            </p>
          </div>
        )}
        {displayWeekStreams && (
          <div className='grid-container'>
            {firstWeekStreams && (
              <WeekSchedule
                weekStreams={firstWeekStreams}
                week='Nuevas clases'
              />
            )}
            {secondWeekStreams && (
              <WeekSchedule weekStreams={secondWeekStreams} week='Semana 2' />
            )}
            {thirdWeekStreams && (
              <WeekSchedule weekStreams={thirdWeekStreams} week='Semana 3' />
            )}
            {fourthWeekStreams && (
              <WeekSchedule
                weekStreams={fourthWeekStreams}
                week='Ultima Semana!'
              />
            )}
          </div>
        )}
        <div className='advertencia-clases-guardadas'>
          <p>
            Recordá que cada clase queda guardada por 4 semanas. Solo tenés que
            apretar en la que quieras tomar (en el calendario de arriba).
          </p>
        </div>
      </div>
    )
  }
}

const MonthSchedule = withFirebase(MonthScheduleBase)
export default MonthSchedule
