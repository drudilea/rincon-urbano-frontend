import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactLoading from 'react-loading'

import { withFirebase } from '../../../Firebase'
import * as ROUTES from '../../../../constants/routes'
import { getMonthStreamsQuery } from '../../../Firebase/Queries/streams'
import {
  assignStreamTeacherProps,
  adminSeparateStreamsByWeek,
} from '../../../../utils/streams'
import { getTeachersQuery } from '../../../Firebase/Queries/users'

import Table from 'react-bootstrap/Table'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

import './stream-create.scss'

class StreamListBase extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      lastWeekStreams: null,
    }
  }

  async componentDidMount() {
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

    const streamsPerWeek = adminSeparateStreamsByWeek(displayWeekStreams)
    const lastWeekStreams = streamsPerWeek[streamsPerWeek.length - 1]

    this.setState({
      displayWeekStreams,
      loading: false,
      lastWeekStreams,
    })
  }

  render() {
    const { lastWeekStreams, loading } = this.state
    return (
      <div className='admin-content-item'>
        <h2 className='admin-item-title'>Clases de la semana</h2>
        {loading && (
          <div className='loading-bubble-container'>
            <ReactLoading
              type={'spin'}
              color={'#333'}
              height={'5%'}
              width={'5%'}
            />
          </div>
        )}
        {!loading && (
          <div className='admin-item-content'>
            <Table>
              <thead>
                <tr>
                  <th>Profe</th>
                  <th>Canción</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {lastWeekStreams &&
                  lastWeekStreams.map((stream) => (
                    <tr key={stream.streamId}>
                      <th>
                        {`${stream.teacherFirstName} ${stream.teacherLastName}`}
                      </th>
                      <th>{stream.teacherFirstName}</th>
                      <th>
                        <Link to={`${ROUTES.ADMIN}/stream/${stream.streamId}`}>
                          <FontAwesomeIcon icon={faEdit} />
                        </Link>
                      </th>
                    </tr>
                  ))}
              </tbody>
            </Table>

            <div className='admin-item-button-container'>
              <Link to={`${ROUTES.STREAM_HISTORY}`}>
                <button className='admin-item-button'>
                  Historial de Streams
                </button>
              </Link>

              <Link to={`${ROUTES.STREAM_CREATE}`}>
                <button className='admin-item-button'>Agregar stream</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    )
  }
}

const StreamList = withFirebase(StreamListBase)

export default StreamList
