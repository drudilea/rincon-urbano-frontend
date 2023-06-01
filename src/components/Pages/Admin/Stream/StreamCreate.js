import React, { Component } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { withFirebase } from '../../../Firebase';
import { getTeachersQuery } from '../../../Firebase/Queries/users';
import './stream-create.scss';

// Returns the ISO week of the date.
// Source: https://weeknumber.net/how-to/javascript
// eslint-disable-next-line no-extend-native
Date.prototype.getWeek = function () {
  var date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
};

// Returns the four-digit year corresponding to the ISO week of the date.
// eslint-disable-next-line no-extend-native
Date.prototype.getWeekYear = function () {
  var date = new Date(this.getTime());
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  return date.getFullYear();
};

class StreamCreateBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: this.getMonday(),
      endDate: this.getMonday(),
      teachers: [],
    };
  }

  onChangeStart = (startDate) => this.setState({ startDate });

  onChangeEnd = (endDate) => this.setState({ endDate });

  async componentDidMount() {
    const teachersResponse = await getTeachersQuery();
    if (teachersResponse.status === 200)
      this.setState({ teachers: teachersResponse.data, loading: false });
    else {
      console.log(
        'Error fetching Teachers ROLES DB ',
        teachersResponse.message
      );
      this.setState({ error: teachersResponse.message, loading: false });
    }
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  onSubmitHandler = (e) => {
    // Obtengo arreglo de los inputs
    e.preventDefault();
    const stream = {};

    const labels = document.querySelectorAll('label');

    // Guardo todos los campos del formulario
    labels.forEach((label) => (stream[label.id] = label.control.value));

    // Guardo los campos con fechas en formato de numero (ms) para poder compararlo con alguna API mas adelante
    labels.forEach((label) => {
      if (label.id === 'startDateTime' || label.id === 'endDateTime') {
        const utcDateAsString = this.dateToUtcIsoString(
          label.control.valueAsNumber
        );
        stream[`${label.id}AsNumber`] = label.control.valueAsNumber;
        stream[`${label.id}UTCString`] = utcDateAsString;
      }
      if (label.id === 'startDateTime') {
        const utcDateAsString = this.dateToUtcIsoString(
          label.control.valueAsNumber
        );
        const utcDate = new Date(utcDateAsString);
        stream[
          'weekNumberOfTheYear'
        ] = `${utcDate.getWeek()}-${utcDate.getWeekYear()}`;
      }
    });

    stream.activeDate = stream.startDateTime.split('T', 1)[0];

    this.props.firebase.streams().push(stream);
    window.location.reload();
  };

  dateToUtcIsoString = (localDateAsNumber) => {
    const utcDateAsString = new Date(
      localDateAsNumber +
        new Date(localDateAsNumber).getTimezoneOffset() * 60000
    );
    return utcDateAsString.toISOString();
  };

  getMonday() {
    let d = new Date();
    d.setHours(0, 0, 0, 0);
    var day = d.getDay(),
      diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  render() {
    const { teachers, startDate, endDate } = this.state;

    return (
      <div>
        <h1>Create Stream</h1>
        <form
          method="post"
          action="submit"
          className="stream-create-form"
          onSubmit={this.onSubmitHandler.bind(this)}
        >
          <label id="startDateTime">
            <strong>Día/Hora de comienzo: </strong>
            <DateTimePicker onChange={this.onChangeStart} value={startDate} />
          </label>

          <label id="endDateTime">
            <strong>Día/Hora de finalizacion: </strong>
            <DateTimePicker onChange={this.onChangeEnd} value={endDate} />
          </label>

          <label id="teacher">
            <strong>Profesor: </strong>
            <select name="" id="">
              {teachers.map((teacher) => (
                <option
                  key={teacher.uid}
                  value={teacher.uid}
                >{`${teacher.firstName} ${teacher.lastName}`}</option>
              ))}
            </select>
          </label>

          <label id="song">
            <strong>Canción: </strong>
            <input type="text" name="song" id="" />
          </label>

          <label id="artist">
            <strong>Artista: </strong>
            <input type="text" name="artist" id="" />
          </label>

          <label id="streamUrl">
            <strong>URL del Stream: </strong>
            <input type="text" name="streamUrl" id="" />
          </label>

          <button type="submit">Crear Stream</button>
        </form>
      </div>
    );
  }
}

const StreamCreate = withFirebase(StreamCreateBase);

export default StreamCreate;
