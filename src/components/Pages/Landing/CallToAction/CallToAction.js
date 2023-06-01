import React from 'react';
import * as ROUTES from '../../../../constants/routes';
import { Link } from 'react-router-dom';
import './calltoaction.scss';

export default function CallToAction() {
  return (
    <div className="CTA-container">
      <span className="CTA-text">Se parte del rincón</span>
      <Link to={ROUTES.SIGN_UP} className="CTA-button">
        <p>Registrate y tomá tu primera clase</p>
      </Link>
    </div>
  );
}
