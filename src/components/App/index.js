import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AccountPage from '../Pages/Account/Account';
import AdminPage from '../Pages/Admin/Admin';
import HomePage from '../Pages/Home/Home';
import LandingPage from '../Pages/Landing/Landing';
import BuyPackPage from '../Pages/BuyPack/BuyPack';
import PasswordForgetPage from '../Shared/PasswordForget/PasswordForget';
import SignInPage from '../Pages/SignIn/SignIn';
import SignUpPage from '../Shared/SignUp/SignUp';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session/Session';
import StreamPage from '../Pages/Streams/Stream';
import PrivacyPolicy from '../Pages/Landing/Contacto/PrivacyPolicy';
import TermsAndConditions from '../Pages/Landing/Contacto/TermsAndConditions';
import PaymentForm from '../Pages/BuyPack/PaymentForm';
import PaymentResult from '../Pages/BuyPack/Redirection/PaymentResult';

const App = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
        <Route path={ROUTES.HOME} component={HomePage} />
        <Route path={ROUTES.ACCOUNT} component={AccountPage} />
        <Route path={ROUTES.ADMIN} component={AdminPage} />
        <Route path={ROUTES.BUY_PACK} component={BuyPackPage} />
        <Route path={ROUTES.STREAM} component={StreamPage} />
        <Route path='/legal/privacy-policy' component={PrivacyPolicy} />
        <Route
          path='/legal/terms-and-conditions'
          component={TermsAndConditions}
        />
        <Route path={ROUTES.PAYMENT_FORM} component={PaymentForm} />
        <Route path={ROUTES.PAYMENT_RESULT} component={PaymentResult} />
        <Route component={HomePage} />
      </Switch>
    </div>
  </Router>
);

export default withAuthentication(App);
