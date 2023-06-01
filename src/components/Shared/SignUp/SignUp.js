import React from 'react';
import { Link } from 'react-router-dom';

import SignInFacebook from '../../Pages/SignIn/SignInMethods/SignInFacebook';
import SignInGoogle from '../../Pages/SignIn/SignInMethods/SignInGoogle';
import SignUpForm from './SingUpForm';
import * as ROUTES from '../../../constants/routes';

import './sign-up.scss';

const SignUpPage = () => (
  <div className="signup-container">
    <div className="signup-frame ">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FIcons%2FlogotipoVerdeBlanco.png?alt=media&token=7e2b6ea0-bfe3-488f-a6e6-4ac27542ad09"
        alt="logo-top"
        className="logo-top"
      ></img>
      <div className="signup-form-container">
        <SignUpForm />
      </div>
      <div className="signup-socials">
        <hr></hr>
        <div className="socials-btn-container">
          <SignInGoogle />
          <SignInFacebook />
        </div>
      </div>
    </div>
  </div>
);

const SignUpLink = () => (
  <p>
    ¿Aún no tienes una cuenta? <Link to={ROUTES.SIGN_UP}>Registrate!</Link>
  </p>
);

export { SignUpLink };
export default SignUpPage;
