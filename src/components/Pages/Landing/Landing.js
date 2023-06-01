import React from 'react';

import Hero from './Hero/Hero';
import Nosotros from './Nosotros/Nosotros';
import HowItWorks from './HowItWorks/HowItWorks';
import Teachers from './Teachers/Teachers';
import Prices from './Prices/Prices.js';
import CallToAction from './CallToAction/CallToAction';
import Contacto from './Contacto/Contacto';

import './landing.scss';

import withAuthorization from '../../Session/withAuthorization';

const LandingPage = () => (
  <div>
    <Hero />
    <Nosotros />
    <Teachers />
    <section className="space-between-sections"></section>
    <HowItWorks />
    <Prices />
    <CallToAction />
    <Contacto />
  </div>
);

const condition = (authUser) => !authUser;
export default withAuthorization(condition)(LandingPage);

//export default LandingPage;
