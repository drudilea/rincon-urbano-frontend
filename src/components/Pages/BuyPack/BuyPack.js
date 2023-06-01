import React from 'react';
import Navigation from '../../Shared/NavigationNon-Auth/Navigation';
import Packs from './Packs';
import { compose } from 'recompose';

import './buy-packs.scss';
import { withAuthorization } from '../../Session/Session';

const BuyPackPage = () => (
  <div className="buy-container">
    <Navigation />

    <h1>Comprar clases</h1>
    <div className="text-description-containter">
      <h3>
        Comprá el paquete que más se ajuste a tus necesidades y tomá las clases
        cuando quieras.
        <br />
        <br /> Cada vez que ingreses a una clase, descontaremos una del paquete
        elegido.
        <br /> <br /> Los precios se encuentran en pesos argentinos, pero al
        momento de realizar la compra,{' '}
        <strong>tu banco realizará la conversion a la moneda local.</strong>
      </h3>
    </div>
    <Packs />
  </div>
);

const condition = (authUser) => !!authUser;

export default compose(withAuthorization(condition))(BuyPackPage);
