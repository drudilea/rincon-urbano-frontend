import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from '../../Shared/SignOut/SignOut';
import { AuthUserContext } from '../../Session/Session';

import * as ROUTES from '../../../constants/routes';
import * as ROLES from '../../../constants/roles';

import BurgerMenu from './BurgerMenu';

import './navigation-nonauth.scss';
import './navigation-auth.scss';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {(authUser) =>
        authUser ? (
          <NavigationAuth authUser={authUser} />
        ) : (
          <NavigationNonAuth />
        )
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = ({ authUser }) => (
  <div className="">
    <div className="responsive-bar">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FIcons%2FlogotipoVerdeBlanco.png?alt=media&token=7e2b6ea0-bfe3-488f-a6e6-4ac27542ad09"
        alt="white-logo"
        className="nav-logo"
      ></img>
      <BurgerMenu user={authUser} />
    </div>

    <div className="navbar-container-auth">
      <div className="navbar-left">
        <Link to={ROUTES.HOME}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FIcons%2FlogotipoVerdeBlanco.png?alt=media&token=7e2b6ea0-bfe3-488f-a6e6-4ac27542ad09"
            alt="white-logo"
          ></img>
        </Link>
      </div>
      <nav role="navigation" className="navbar-right">
        <Link to={ROUTES.BUY_PACK} className="buy-btn">
          <p>Comprar clases</p>
        </Link>
        <Link to={ROUTES.HOME} className="normal-btn">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FIcons%2Fhome-btn.png?alt=media&token=6c828260-4987-4682-bf54-b68564e48696"
            alt=""
          />
          Portal
        </Link>

        <Link to={ROUTES.ACCOUNT} className="normal-btn">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FIcons%2Faccount-2.png?alt=media&token=3bd557c0-e192-4a0e-8ff9-7ce76e5a1a7c"
            alt=""
          />
          Configuración
        </Link>
        <SignOutButton />
        <img src={authUser.imgUrl} alt="" className="profile-pic" />
        {!!authUser.roles[ROLES.ADMIN] && (
          <Link to={ROUTES.ADMIN} className="normal-btn">
            Admin Page
          </Link>
        )}
      </nav>
    </div>
  </div>
);

const NavigationNonAuth = () => (
  <div className="navbar-container-nonauth">
    <div className="navbar-left">
      <nav>
        <Link to={ROUTES.LANDING}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FIcons%2FlogotipoVerdeBlanco.png?alt=media&token=7e2b6ea0-bfe3-488f-a6e6-4ac27542ad09"
            alt="white-logo"
          ></img>
        </Link>
        <ul className="">
          <li>
            <a href="#nosotros">QUIENES SOMOS</a>
          </li>
          <li>
            <a href="#profes">LOS PROFES</a>
          </li>
          <li>
            <a href="#opciones">CLASES</a>
          </li>
          <li>
            <a href="#precios">PRECIOS</a>
          </li>
        </ul>
      </nav>
    </div>

    <nav role="navigation" className="navbar-right">
      <Link to={ROUTES.SIGN_IN} className="btn btn-login">
        <p>Iniciar Sesión</p>
      </Link>
      <Link to={ROUTES.SIGN_UP} className="btn btn-register">
        <p>Registrarme</p>
      </Link>
    </nav>
  </div>
);

export default Navigation;
