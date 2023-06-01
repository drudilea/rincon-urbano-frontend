import React from 'react';
import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { userEnterStreamProcess } from '../../../../utils/streams';
import { getUserEnterStreamAvailable } from '../../../Firebase/Queries/streams';
import DesktopWeekStreams from '../../../Shared/ResponsiveWeekStreams/DesktopWeekStreams';
import MobileWeekStreams from '../../../Shared/ResponsiveWeekStreams/MobileWeekStreams';

class WeekScheduleBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(sessionStorage.getItem('authUser')),
    };
  }

  async onClickHandler(stream, e) {
    const userId = this.state.user.uid;
    const history = this.props.history;
    const userStreamsAvailable = await getUserEnterStreamAvailable(
      userId,
      stream
    );
    userEnterStreamProcess(userStreamsAvailable, stream, history, userId);
  }

  render() {
    return (
      <div className="week-container">
        <h1>{this.props.week}</h1>
        <DesktopWeekStreams
          onClickHandler={this.onClickHandler.bind(this)}
          weekStreams={this.props.weekStreams}
        />
        <MobileWeekStreams
          onClickHandler={this.onClickHandler.bind(this)}
          weekStreams={this.props.weekStreams}
        />
      </div>
    );
  }
}

const WeekSchedule = withRouter(WeekScheduleBase);
export default WeekSchedule;
