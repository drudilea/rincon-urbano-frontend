import React, { Component } from 'react';
import { withFirebase } from '../../../Firebase';
import { Redirect } from 'react-router-dom';

import * as ROUTES from '../../../../constants/routes';

class StreamItemBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      stream: null,
      teacher: null,
      redirect: false,
      streamUrl: null,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    let stream, teacher;
    try {
      this.props.firebase
        .stream(this.props.match.params.id)
        .on('value', (snapshot) => {
          stream = snapshot.val();
          // Una vez que obtengo el stream, busco el profesor correspondiente
          if (stream) {
            this.props.firebase
              .user(stream.teacher)
              .once('value', (snapshot) => {
                teacher = snapshot.val();

                this.setState({
                  invalidStream: false,
                  stream,
                  teacher,
                  loading: false,
                  streamUrl: stream.streamUrl,
                });
              });
          } else {
            this.setState({ invalidStream: true, loading: false });
          }
        });
    } catch (e) {
      console.log('Error al acceder a la base de datos', e);
      this.setState({
        invalidStream: false,
        stream,
        teacher,
        loading: false,
      });
    }
  }

  componentWillUnmount() {
    this.props.firebase.stream(this.props.match.params.id).off();
    // this.props.firebase.user(this.state.stream.teacher).off();
  }

  handleOnClick(e) {
    e.preventDefault();
    let result = window.confirm('Are u sure `bout dat nigga?');
    if (result) {
      try {
        this.props.firebase.stream(this.props.match.params.id).remove();
        this.setState({ redirect: true });
      } catch (e) {
        console.log('Error en el remove del firebase: ', e);
      }
    }
  }

  handleSubmit(e) {
    const { stream, streamUrl } = this.state;
    e.preventDefault();
    stream.streamUrl = streamUrl;
    this.props.firebase.stream(this.props.match.params.id).update(stream);

    window.location.reload();
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { loading, teacher, stream, invalidStream, streamUrl } = this.state;
    if (this.state.redirect) {
      return <Redirect push to={ROUTES.ADMIN} />;
    }
    return (
      <div>
        <h2>Stream:</h2>
        {invalidStream && <div>Stream invalido!</div>}
        {loading && <div>Cargando stream...</div>}
        {(stream && teacher && (
          <div>
            <span>
              <strong>Profesor: </strong>
              {`${teacher.firstName} ${teacher.lastName}`}
            </span>
            <br />
            <span>
              <strong>Estilo: </strong>
              {teacher.style}
            </span>
            <br />
            <span>
              <strong>Fecha y hora de inicio: </strong> {stream.startDateTime}
            </span>
            <br />
            <span>
              <strong>Fecha y hora de finalizacion: </strong>{' '}
              {stream.endDateTime}
            </span>
            <br />
            <span>
              <strong>Sala: </strong> {stream.room}
            </span>
            <br />
            <form onSubmit={this.handleSubmit.bind(this)}>
              <span>
                <label>
                  <strong>URL streaming: </strong>
                  <input
                    name="streamUrl"
                    value={streamUrl}
                    onChange={this.onChange}
                    type="text"
                  />
                </label>
              </span>
              <button type="submit">Modificar</button>
            </form>
            <div className="buttons-container">
              <button type="submit" onClick={this.handleOnClick.bind(this)}>
                Eliminar Stream
              </button>
            </div>
          </div>
        )) ||
          (!teacher && !loading && <div>Profesor no existe!</div>)}
      </div>
    );
  }
}

const StreamItem = withFirebase(StreamItemBase);

export default StreamItem;
