import React, { Component } from 'react';

import { withFirebase } from '../../Firebase';
import './password-change.scss';

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { passwordOne } = this.state;

    this.props.firebase
      .doPasswordUpdate(passwordOne)
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
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

    return (
      <form onSubmit={this.onSubmit} className="password-change-form">
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="Nueva contraseña"
          className="form-input"
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirmar nueva contraseña"
          className="form-input"
        />
        <button
          disabled={isInvalid}
          type="submit"
          className="change-password-button"
        >
          <p>Resetear mi contraseña</p>
        </button>
        {error && <p>{error.message}</p>}
        {/* {isInvalid && <p>Las contraseñas deben coincidir</p>} */}
      </form>
    );
  }
}

export default withFirebase(PasswordChangeForm);
