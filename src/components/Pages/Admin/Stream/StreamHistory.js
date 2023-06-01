import React, { Component } from 'react';
import { withFirebase } from '../../../Firebase/';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../../constants/routes';

class StreamHistoryBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    // Obtengo los streams historicos
    this.props.firebase.streams().on('value', (snapshot) => {
      let streamsList;
      try {
        const streamsObject = snapshot.val();
        streamsList = Object.keys(streamsObject).map((key) => ({
          ...streamsObject[key],
          uid: key,
        }));
      } catch (e) {
        console.log('Fetch history streams ', e);
      } finally {
        this.setState({
          allStreams: streamsList,
          loading: false,
        });
      }
    });
  }

  componentWillUnmount() {
    this.props.firebase.streams().off();
  }

  render() {
    const { loading, allStreams } = this.state;

    return (
      <div>
        <h2>Stream History:</h2>
        {loading && <div>Cargando streams...</div>}
        {allStreams && (
          <div>
            <ul>
              {allStreams.map((stream) => (
                <li key={stream.uid}>
                  <span>
                    <strong>Stream ID:</strong> {stream.uid}
                  </span>
                  <br />
                  <span>
                    <strong>Profe:</strong> {stream.teacher}
                  </span>
                  <br />
                  <span>
                    <strong>Fecha:</strong>
                    {stream.startDateTime.split('T', 2)[0]}
                  </span>
                  <br />
                  <span>
                    <strong>Horario:</strong>
                    {`${stream.startDateTime.split('T', 2)[1]} hs`}
                  </span>
                  <br />
                  <Link to={`${ROUTES.ADMIN}/stream/${stream.uid}`}>
                    Visitar stream
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}
const StreamHistory = withFirebase(StreamHistoryBase);
export default StreamHistory;
