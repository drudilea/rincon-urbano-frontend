import React from 'react';
import { Component } from 'react';
import { withFirebase } from '../../../Firebase';
import ReactLoading from 'react-loading';

import { getUserAvailablePacks } from '../../../Firebase/Queries/user-packs';
import { getUserInfo } from '../../../Firebase/Queries/users';

import './progress.scss';

class ProgressBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      streamTakenCant: null,
      favTeacher: null,
      favTeacherStreamsCant: null,
      favStyle: null,
      user: JSON.parse(sessionStorage.getItem('authUser')),
      userPacks: null,
      loading: true,
    };
  }

  async componentDidMount() {
    const userResponse = await getUserInfo(this.state.user.uid);
    if (userResponse.status === 200) {
      this.updateUserInfo(userResponse.data);
      this.setState({ user: userResponse.data });
    } else {
      console.log('Error fetching Teachers ROLES DB ', userResponse.message);
      this.setState({ error: userResponse.message });
    }

    const updatedUserPacksResponse = await getUserAvailablePacks(
      this.state.user.uid
    );
    if (updatedUserPacksResponse?.status === 200) {
      this.setState({ userPacks: updatedUserPacksResponse.data });
    } else {
      this.setState({ userPacks: updatedUserPacksResponse.data });
      console.log(
        'Error al buscar packs disponibles de un usuario especifico',
        updatedUserPacksResponse.error
      );
    }

    if (this.state.user.streamsTaken) {
      //prettier-ignore
      let infoToDisplay = { streamTakenCant: null, favTeacher: null, favTeacherStreamsCant: null, favStyle: null };

      // Obtengo una lista de streams a los que ingreso el usuario
      const streamsTakenObjectList = Object.keys(
        this.state.user.streamsTaken
      ).map((key) => ({
        ...this.state.user.streamsTaken[key],
      }));
      infoToDisplay.streamTakenCant = streamsTakenObjectList.length;

      // Obtengo los profesores de cada stream tomado por el usuario
      let totalTeachersIdList = [];
      streamsTakenObjectList.forEach((streamTakenObject) => {
        totalTeachersIdList.push(streamTakenObject.teacher);
      });
      // Cuento la cantidad de veces que se repite cada profe
      let count = {};
      totalTeachersIdList.forEach(function (i) {
        count[i] = (count[i] || 0) + 1;
      });
      // Elijo el que mas se haya repetido
      const favTeacher = Object.keys(count).reduce((a, b) =>
        count[a] > count[b] ? a : b
      );
      infoToDisplay.favTeacherStreamsCant = count[favTeacher];
      // Obtengo los datos del profe preferido
      const teacherResponse = await getUserInfo(favTeacher);
      if (userResponse.status === 200) {
        infoToDisplay.favTeacher = `${teacherResponse.data.firstName} ${teacherResponse.data.lastName}`;
        infoToDisplay.favStyle = `${teacherResponse.data.style}`;
        this.setState(infoToDisplay);
      } else {
        console.log('Error fetching teacher ', teacherResponse.message);
        this.setState({ error: teacherResponse.message });
      }
    } else {
      this.setState({ streamTakenCant: 0 });
    }
    this.setState({ loading: false });
  }

  updateUserInfo(user) {
    sessionStorage.setItem('authUser', JSON.stringify(user));
  }

  componentWillUnmount() {}

  render() {
    //prettier-ignore
    const { user, streamTakenCant, favTeacher, favTeacherStreamsCant, favStyle, userPacks, loading } = this.state;
    let streamsLeft = 0;
    if (userPacks) {
      userPacks.forEach((userPack) => {
        streamsLeft += userPack.streamsLeft;
      });
    }

    return (
      <div className="progress-container">
        <div className="progress-header">
          <div className="left-header">
            <h1 className="progress-user">{`${user.firstName} ${user.lastName}`}</h1>
            <hr></hr>
          </div>
          <img src={user.imgUrl} alt="" />
        </div>
        {loading && (
          <div className="loading">
            <ReactLoading
              type={'spin'}
              color={'#333'}
              height={'50px'}
              width={'50px'}
            />
          </div>
        )}
        {!loading && (
          <div className="progress-content">
            <div className="user-packs">
              <div className="user-packs-details">
                <span className="streams-left-number">{streamsLeft}</span>
              </div>
              <br />
              <span className="streams-left-description">
                {` ${
                  streamsLeft !== 1 ? 'clases disponibles' : 'clase disponible'
                }`}
              </span>
            </div>
            <div className="taken-streams">
              <span className="taken-streams-number">{streamTakenCant}</span>

              <br />
              <span className="taken-streams-description">{`
                          ${
                            streamTakenCant !== 1
                              ? 'clases tomadas'
                              : 'clase tomada'
                          }`}</span>
            </div>
            <div className="stats-profes-style">
              {(favTeacher && (
                <div>
                  <div className="favourite-profe">
                    <span className="stats-description">
                      Tu referente preferido:
                    </span>
                    <div className="favourite-profe-content">
                      <span className="favourite-profe-name">{`${favTeacher}`}</span>
                      <br />
                      <span className="favourite-profe-qty">
                        {`(${favTeacherStreamsCant} ${
                          favTeacherStreamsCant !== 1 ? 'clases' : 'clase'
                        })`}
                      </span>
                    </div>
                  </div>
                  <div className="favourite-style">
                    <span className="stats-description">
                      Estilo más elegido
                    </span>
                    <span className="favourite-style-content">{favStyle}</span>
                  </div>
                </div>
              )) ||
                (!favTeacher && !loading && (
                  <div>
                    <span className="number2-profe">
                      Todavía no has tomado ninguna clase
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const Progress = withFirebase(ProgressBase);
export default Progress;
