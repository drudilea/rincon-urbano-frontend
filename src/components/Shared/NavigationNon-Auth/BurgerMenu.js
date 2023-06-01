import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';
import SignOutButton from '../../Shared/SignOut/SignOut';

import './burger-menu.scss';

export default class BurgerMenu extends Component {
  showSettings(event) {
    event.preventDefault();
  }

  render() {
    return (
      <Menu
        customBurgerIcon={
          <img
            src="https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FIcons%2Fburguermenu-customImg.png?alt=media&token=bea34e94-7c9b-47d7-bcf0-94fbfd2558ce"
            alt="burger-menu-icon"
          />
        }
        right
        width={'70%'}
      >
        <div className="burger-menu-profile">
          <img
            src={this.props.user.imgUrl}
            className="burger-menu-img"
            alt="burger-menu-icon"
          />
          <span className="burger-menu-name">
            {`${this.props.user.firstName} ${this.props.user.lastName}`}{' '}
          </span>
          <SignOutButton />
        </div>
        <div className="menu-items-container">
          <Link to={ROUTES.HOME} className="burger-menu-item">
            <p>Portal</p>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FIcons%2Fhome-btn.png?alt=media&token=6c828260-4987-4682-bf54-b68564e48696"
              alt="portal-icon"
            />
          </Link>
          <Link to={ROUTES.BUY_PACK} className="burger-menu-item">
            <p>Comprar clases</p>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FIcons%2Fbuy-icon.png?alt=media&token=94523131-c3bc-4f9e-be4d-49c9ae9b1672"
              alt="buy-classes-icon"
            />
          </Link>
          <Link to={ROUTES.ACCOUNT} className="burger-menu-item">
            <p>Configuración</p>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FIcons%2Faccount-2.png?alt=media&token=3bd557c0-e192-4a0e-8ff9-7ce76e5a1a7c"
              alt="config-icon"
            />
          </Link>
        </div>
      </Menu>
    );
  }
}
