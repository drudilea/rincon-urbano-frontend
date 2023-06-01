import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withFirebase } from '../../../Firebase';
import * as ROLES from '../../../../constants/roles';
import * as ROUTES from '../../../../constants/routes';

class UserItemBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: null,
      redirect: false,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    try {
      this.props.firebase
        .user(this.props.match.params.id)
        .on('value', (snapshot) => {
          const user = snapshot.val();
          if (user) {
            const userRoles = Object.keys(user.roles);
            const isAdmin = userRoles.includes(ROLES.ADMIN);
            const isTeacher = userRoles.includes(ROLES.TEACHER);
            this.setState({
              user,
              userRoles,
              isAdmin,
              isTeacher,
              loading: false,
            });
          } else {
            this.setState({
              loading: false,
            });
          }
        });
    } catch (e) {
      console.log('Error fetching User DB: ', e);
      this.setState({
        loading: false,
      });
    }
  }

  componentWillUnmount() {
    this.props.firebase.user(this.props.match.params.id).off();
  }

  onChangeCheckbox = (event) => {
    this.setState({ [event.target.name]: event.target.checked });
    const changedRole =
      event.target.name === 'isTeacher' ? ROLES.TEACHER : ROLES.ADMIN;
    const roles = this.state.user.roles;

    if (event.target.checked === true) {
      // Agregar rol (update)
      roles[changedRole] = changedRole;
    } else {
      // Sacar rol (remove)
      delete roles[changedRole];
    }

    this.updateRoles(roles);
  };

  updateRoles(rolesObject) {
    this.props.firebase.user(this.props.match.params.id).update({
      roles: rolesObject,
    });
    window.location.reload();
  }

  async handleOnClick(e) {
    e.preventDefault();
    let result = window.confirm('Are u sure `bout dat nigga?');
    if (result) {
      try {
        await fetch('/api/firebase/user?id=' + this.props.match.params.id, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.ok) this.setState({ redirect: true, user: null });
          });
      } catch (e) {
        console.log('Error al eliminar User de DB: ', e);
      }
    }
  }

  render() {
    const { user, userRoles, isAdmin, isTeacher, loading } = this.state;
    if (this.state.redirect) {
      return <Redirect push to={ROUTES.ADMIN} />;
    }
    return (
      <div>
        <h2>User: {user && user.firstName}</h2>
        {loading && <div>Cargando usuario...</div>}
        {user && (
          <div>
            <span>
              <strong>FOTO:</strong> <img src={user.imgUrl} alt="" />
            </span>
            <br />
            <span>
              <strong>ID:</strong> {this.props.match.params.id}
            </span>
            <br />
            <span>
              <strong>Nombre Completo:</strong>
              {` ${user.firstName} ${user.lastName}`}
            </span>
            <br />
            <span>
              <strong>E-Mail:</strong> {user.email}
            </span>
            <br />
            <span>
              <strong>Roles:</strong>
              <ul>
                {userRoles.map((role) => (
                  <li key={role}>{role}</li>
                ))}
              </ul>
            </span>
            <label>
              Admin:
              <input
                name="isAdmin"
                type="checkbox"
                checked={isAdmin}
                onChange={this.onChangeCheckbox}
              />
            </label>
            <label>
              Teacher:
              <input
                name="isTeacher"
                type="checkbox"
                checked={isTeacher}
                onChange={this.onChangeCheckbox}
              />
            </label>
            <br />
            <div>
              <button type="submit" onClick={this.handleOnClick.bind(this)}>
                Eliminar Usuario
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const UserItem = withFirebase(UserItemBase);

export default UserItem;
