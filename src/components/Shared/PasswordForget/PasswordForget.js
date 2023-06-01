import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import { withFirebase } from '../../Firebase';

import * as ROUTES from '../../../constants/routes';

import './passwordforget.scss';

const PasswordForgetPage = () => (
  <div className="password-forget-container">
    <div className="password-forget">
      <h1 className="password-forget-title">Olvidé mi contraseña</h1>
      <PasswordForgetForm />
    </div>
  </div>
);

const INITIAL_STATE = {
  email: '',
  error: null,
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email } = this.state;
    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch((error) => {
        this.setState({ error });
      });
    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, error } = this.state;
    const isInvalid = email === '';

    return (
      <form onSubmit={this.onSubmit} className="password-forget-form">
        <input
          name="email"
          value={this.state.email}
          onChange={this.onChange}
          type="email"
          placeholder="Ingresa tu email"
          className="password-forget-input"
        />
        <button
          disabled={isInvalid}
          type="submit"
          className="password-forget-button"
        >
          Reestablecer mi contraseña
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>¿Olvidaste tu contraseña?</Link>
  </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
