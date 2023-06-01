import React, { Component } from 'react';
import { withFirebase } from '../../../Firebase';

import { getUserInfo } from '../../../Firebase/Queries/users';

class TeacherItemBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: null,
    };
  }

  async componentDidMount() {
    this.setState({ loading: true });
    const userResponse = await getUserInfo(this.props.match.params.id);
    if (userResponse.status === 200)
      this.setState({ user: userResponse.data, loading: false });
    else {
      console.log('Error fetching Teachers ROLES DB ', userResponse.message);
      this.setState({ error: userResponse.message, loading: false });
    }
  }

  componentWillUnmount() {
    this.props.firebase.user(this.props.match.params.id).off();
  }

  handleSubmit(e) {
    const style = document.querySelector('.style-input').value;
    const country = document.querySelector('.country-input').value;
    const displayImg = document.querySelector('.displayImg-input').value;
    const landingImg = document.querySelector('.landingImg-input').value;
    const linkInstagram = document.querySelector('.linkInstagram-input').value;

    const additionalTeacherInfo = {
      style,
      country,
      displayImg,
      landingImg,
      linkInstagram,
    };

    this.props.firebase
      .user(this.props.match.params.id)
      .update(additionalTeacherInfo);

    e.preventDefault();
    window.location.reload();
  }

  render() {
    const { user, loading } = this.state;

    return (
      <div>
        <h2>Teacher: {user && user.firstName}</h2>
        {loading && <div>Cargando profesor...</div>}
        {user && (
          <div>
            <div className="user-item-container">
              <span className="user-item-left">
                <img src={user.imgUrl} alt="" />
              </span>
              <br />

              <div className="user-item-right">
                <span>
                  <label>
                    <strong>Nombre Completo: </strong>
                    <input
                      defaultValue={` ${user.firstName} ${user.lastName}`}
                      type="text"
                      ref={this.input}
                      disabled
                    />
                  </label>
                </span>
                <br />

                <span>
                  <label>
                    <strong>Email: </strong>
                    <input
                      defaultValue={user.email}
                      type="text"
                      ref={this.input}
                      disabled
                    />
                  </label>
                </span>
                <br />

                <span>
                  <label>
                    <strong>ID: </strong>
                    <input
                      defaultValue={user.uid}
                      type="text"
                      ref={this.input}
                      disabled
                    />
                  </label>
                </span>
                <br />

                <form
                  method="post"
                  action="submit"
                  onSubmit={this.handleSubmit.bind(this)}
                >
                  <span>
                    <label>
                      <strong>Estilo: </strong>
                      <input
                        defaultValue={user.style}
                        type="text"
                        ref={this.input}
                        className="style-input"
                      />
                    </label>
                  </span>
                  <br />

                  <span>
                    <label>
                      <strong>País: </strong>
                      <input
                        defaultValue={user.country}
                        type="text"
                        ref={this.input}
                        className="country-input"
                      />
                    </label>
                  </span>
                  <br />

                  <span>
                    <label>
                      <strong>Link a foto de clases: </strong>
                      <input
                        defaultValue={user.displayImg}
                        type="text"
                        ref={this.input}
                        className="displayImg-input"
                      />
                    </label>
                  </span>
                  <br />

                  <span>
                    <label>
                      <strong>Link a foto de landing: </strong>
                      <input
                        defaultValue={user.landingImg}
                        type="text"
                        ref={this.input}
                        className="landingImg-input"
                      />
                    </label>
                  </span>
                  <br />

                  <span>
                    <label>
                      <strong>Link a perfil de Instagram: </strong>
                      <input
                        defaultValue={user.linkInstagram}
                        type="text"
                        ref={this.input}
                        className="linkInstagram-input"
                      />
                    </label>
                  </span>
                  <br />

                  <button type="submit">Modificar</button>
                </form>
              </div>
            </div>
            <p>
              Para cambiar los tipos de roles, se debe hacerlo desde la lista de
              usuarios en Admin. Aca unicamente se pueden modificar atributos de
              los profesores.
            </p>
            <br />
          </div>
        )}
      </div>
    );
  }
}

const TeacherItem = withFirebase(TeacherItemBase);

export default TeacherItem;
