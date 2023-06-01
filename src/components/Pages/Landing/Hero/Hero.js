import React from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../../Shared/NavigationNon-Auth/Navigation';
import * as ROUTES from '../../../../constants/routes';

import './hero.scss';

function Hero(props) {
  return (
    <div>
      <section className="landing-hero">
        <Navigation />
        <div className="main-hero">
          <div className="left-hero">
            <h1>
              Tu casa <br />
              Tu academia
            </h1>
            <hr className="landing-bar"></hr>
            <h2>
              Formate desde donde estés con grandes referentes en danzas y elevá
              tu nivel al máximo
            </h2>

            <Link to={ROUTES.SIGN_UP} className="free-class-btn">
              <p>Registrate y tomá tu primera clase</p>
            </Link>
          </div>
        </div>
        <div className="arrow-container">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FIcons%2FdownArrow.png?alt=media&token=096a7920-5eb0-4140-abf0-8758512be92e"
            alt=""
            className="down-arrow"
          />
        </div>
      </section>
    </div>
  );
}

export default Hero;
