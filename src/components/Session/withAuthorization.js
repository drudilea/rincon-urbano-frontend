import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

// // short version of authUser => authUser != null;
// const condition = authUser => !!authUser;
// // role-based authorization
// const condition = authUser => authUser.role === 'ADMIN';
// // permission-based authorization
// const condition = authUser => authUser.permissions.canEditAccount;

const withAuthorization = (condition) => (Component) => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        // Next function
        (authUser) => {
          if (!condition(authUser)) {
            this.props.history.push(ROUTES.HOME);
          }
        },
        // Fallback function
        () => this.props.history.push(ROUTES.LANDING)
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {(authUser) =>
            condition(authUser) ? <Component {...this.props} /> : null
          }
        </AuthUserContext.Consumer>
      );
    }
  }
  return compose(withRouter, withFirebase)(WithAuthorization);
};
export default withAuthorization;
