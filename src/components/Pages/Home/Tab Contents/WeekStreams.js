import React from 'react';
import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../../../Firebase';
import { compose } from 'recompose';

import { getTeachersQuery } from '../../../Firebase/Queries/users';
// prettier-ignore
import { getWeekStreamsQuery, getUserEnterStreamAvailable } from '../../../Firebase/Queries/streams'

// prettier-ignore
import { assignStreamTeacherProps, userEnterStreamProcess } from '../../../../utils/streams'

import ReactLoading from 'react-loading';
import './weekStreams.scss';

class WeekStreamsBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      teachersList: null,
      error: null,
    };
  }

  async componentDidMount() {
    this.setState({ loading: true });

    const teachersResponse = await getTeachersQuery();
    if (teachersResponse.status === 200)
      this.setState({ teachers: teachersResponse.data });
    else {
      console.log(
        'Error fetching Teachers ROLES DB ',
        teachersResponse.message
      );
      this.setState({ error: teachersResponse.message });
    }

    // prettier-ignore
    const { status: streamsQueryStatus, weekStreams, message: streamsQueryMessage } = await getWeekStreamsQuery()
    if (streamsQueryStatus === 200) this.setState({ weekStreams });
    else this.setState({ error: streamsQueryMessage });

    const displayStreams = assignStreamTeacherProps(
      this.state.teachers,
      weekStreams
    );

    this.setState({
      displayStreams,
      loading: false,
    });
  }

  async onClickHandler(stream, e) {
    const userId = this.props.user.uid;
    const history = this.props.history;
    const userStreamsAvailable = await getUserEnterStreamAvailable(
      userId,
      stream
    );
    userEnterStreamProcess(userStreamsAvailable, stream, history, userId);
  }

  render() {
    const { displayStreams, loading } = this.state;
    return (
      <div className="streams-container">
        {loading && (
          <div className="loading">
            <ReactLoading
              type={'spin'}
              color={'#fff'}
              height={'50px'}
              width={'50px'}
            />
          </div>
        )}
        {displayStreams && displayStreams.length === 0 && (
          <div className="no-streams">
            <p>
              No hay clases habilitadas para esta semana, revisá la pestaña de{' '}
              <strong>clases del mes</strong> para ver las clases de semanas
              anteriores.
            </p>
          </div>
        )}
        {displayStreams && displayStreams.length > 0 && (
          <div className="streams-content">
            {displayStreams.map((stream) => (
              <div className="stream-item" key={stream.streamId}>
                <div className="top-stream-item">
                  <span
                    className={
                      'stream-item-style ' +
                      stream.teacherStyle.toLowerCase().replace(/\s/g, '')
                    }
                  >
                    {stream.teacherStyle}
                  </span>
                  <img
                    src={stream.teacherDisplayImg}
                    alt=""
                    className="stream-item-img"
                  />
                </div>
                <div className="bottom-stream-item">
                  <div className="item-teacher-fullname">
                    <span className="item-teacher-firstname">
                      {stream.teacherFirstName}
                    </span>
                    <span className="item-teacher-lastname">
                      {stream.teacherLastName}
                    </span>
                  </div>
                  <div className="item-song">
                    <span className="item-song-name">{stream.streamSong}</span>
                    {stream.streamArtist && (
                      <span className="item-song-artist">
                        {stream.streamArtist.toString().toLowerCase()}
                      </span>
                    )}
                  </div>
                  <button onClick={(e) => this.onClickHandler(stream, e)}>
                    <span className="item-button-text">Tomar clase</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

const WeekStreams = compose(withRouter, withFirebase)(WeekStreamsBase);

export default WeekStreams;
