import React from 'react';

import { AuthUserContext } from '../Session/Session';
import { withFirebase } from '../Firebase';

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        // If there is no auth user in the local storage, the local state will stay null
        authUser: JSON.parse(sessionStorage.getItem('authUser')),
      };
    }

    componentDidMount() {
      //this listener is listening for an auth change. whenever a user sign in or out, this function is invoked by the firebase API.
      this.listener = this.props.firebase.onAuthUserListener(
        // Next function: if it's auth
        (authUser) => {
          sessionStorage.setItem('authUser', JSON.stringify(authUser));
          this.setState({ authUser });
        },
        // Fallback function: if it's not
        () => {
          sessionStorage.removeItem('authUser');
          this.setState({ authUser: null });
        }
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication;
