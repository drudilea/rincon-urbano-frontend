import React, { Component } from 'react';
import Navigation from '../../Shared/NavigationNon-Auth/Navigation';
import { withFirebase } from '../../Firebase';
import { compose } from 'recompose';
import { withAuthorization } from '../../Session/Session';

import './stream.scss';
import ReactPlayer from 'react-player';

class StreamPageBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayUsers: [],
    };
  }

  componentDidMount() {
    try {
      this.props.firebase
        .stream(`${this.props.location.state.streamId}/objectUserPrice`)
        .on('value', (snapshot) => {
          const objectUserPrice = snapshot.val();
          if (objectUserPrice) {
            const userPriceList = Object.keys(objectUserPrice).map((key) => ({
              ...objectUserPrice[key],
            }));
            this.setState({ displayUsers: userPriceList });
          }
        });
    } catch (e) {
      console.log('Error fetching ObjectUserPrice DB', e);
    }
  }

  componentWillUnmount() {
    this.props.firebase
      .stream(`${this.props.location.state.streamId}/objectUserPrice`)
      .off();
  }

  render() {
    const { displayUsers } = this.state;
    return (
      <div className="view-stream-container">
        <Navigation />
        <p className="connection-text">
          Si experimentás problemas en la conexión, te recomendamos que vuelvas
          a la sección <strong>portal</strong> e ingreses nuevamente. No te
          descontaremos la clase si ya ingresaste anteriormente.
        </p>
        {this.props.location.state.streamUrl && (
          <div className="stream-container">
            <ReactPlayer
              url={`https://vimeo.com/${this.props.location.state.streamUrl}`}
              controls
              className="react-player"
              height="90%"
              width="90%"
            />
          </div>
        )}
        {displayUsers && (
          <div className="users-pics-container">
            {displayUsers.map((user) => (
              <div className="user-item" key={user.user}>
                <h3>{user.userFullName}</h3>
                <img src={user.userImgUrl} alt="" />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

const condition = (authUser) => !!authUser;
const StreamPage = withFirebase(StreamPageBase);
export default compose(withAuthorization(condition))(StreamPage);
