import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../../Shared/SignUp/SignUp';
import { PasswordForgetLink } from '../../Shared/PasswordForget/PasswordForget';
import SignInGoogle from './SignInMethods/SignInGoogle';
import SignInFacebook from './SignInMethods/SignInFacebook';

import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';

import './signin.scss';

const SignInPage = () => (
  <div className="login-container">
    <div className="left-login-container"></div>
    <div className="right-login-container">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FIcons%2FlogotipoVerdeNegro.png?alt=media&token=d9227368-500c-405e-984d-5de525c81ce6"
        alt="logo-top"
        className="logo-top"
      ></img>

      <div className="login-form-container">
        <SignInForm />
        <hr></hr>
        <div className="login-socials">
          <SignInGoogle />
          <SignInFacebook />
        </div>
      </div>
      <div className="signup-form-container">
        <SignUpLink />
      </div>
    </div>
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';
const ERROR_MSG_ACCOUNT_EXISTS = `
An account with this E-Mail address already exists.
Try to login with this account instead. If you think the
account is already used from one of the social logins, try to sign-in with one of them. Afterward, associate your accounts on your personal account page.
`;

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email, password } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
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
    const { email, password, error } = this.state;
    const isInvalid = password.length < 6 || email === '';

    return (
      <form onSubmit={this.onSubmit} className="emailpass-container">
        <input
          className="form-input"
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email"
          autoComplete="off"
        />
        <input
          className="form-input"
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Contraseña"
        />
        <span className="forgot-pass">
          <PasswordForgetLink />
        </span>

        <button disabled={isInvalid} type="submit" className="signIn-button">
          <span>Iniciar Sesión</span>
        </button>

        {error && <p className="user-pass-error">{error.message}</p>}
      </form>
    );
  }
}

const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);

export { SignInForm };

//export default SignInPage;
export default SignInPage;
