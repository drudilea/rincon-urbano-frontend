import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';
import * as ROLES from '../../../constants/roles';

import './signupform.scss';

const INITIAL_STATE = {
  firstName: '',
  lastName: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  isAdmin: false,
  freeClasses: 0,
  imgUrl:
    'https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FusersProfilePics%2F000defaultProfilePic.JPG?alt=media&token=9d9f7877-4483-4efd-b75d-95555ce09538',
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';
const ERROR_MSG_ACCOUNT_EXISTS = `
Ya existe una cuenta con este mail. Pruebe iniciando sesión.
  `;

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      firstName,
      lastName,
      email,
      passwordOne,
      freeClasses,
      imgUrl,
    } = this.state;

    const roles = {};
    roles[ROLES.STUDENT] = ROLES.STUDENT;

    this.props.firebase
      // Creates a user in Firebase internal authentication database
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((authUser) => {
        // Create a user in Firebase realtime database
        return this.props.firebase.user(authUser.user.uid).set({
          firstName,
          lastName,
          email,
          freeClasses,
          roles,
          imgUrl,
        });
      })
      .then(() => {
        return this.props.firebase.doSendEmailVerification();
      })
      .then(() => {
        return this.props.history.push(ROUTES.HOME);
      })

      .catch((error) => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      firstName,
      lastName,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      firstName === '' ||
      lastName === '';

    return (
      <form onSubmit={this.onSubmit} className="form-container">
        <input
          className="form-input"
          name="firstName"
          value={firstName}
          onChange={this.onChange}
          type="text"
          placeholder="Nombre"
          required
        />
        <input
          className="form-input"
          name="lastName"
          value={lastName}
          onChange={this.onChange}
          type="text"
          placeholder="Apellido"
          required
        />

        <input
          className="form-input"
          name="email"
          value={email}
          onChange={this.onChange}
          type="email"
          placeholder="Email"
          required
        />
        <input
          className="form-input"
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="Contraseña"
          required
        />
        <input
          className="form-input last"
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Repite la contraseña"
          required
        />

        <button disabled={isInvalid} type="submit" className="signIn-button">
          Registrate
        </button>
        {error && <p className="register-error">{error.message}</p>}
      </form>
    );
  }
}

const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase);
export default SignUpForm;
