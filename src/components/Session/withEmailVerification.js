import React from 'react';
import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const needsEmailVerification = (authUser) =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map((provider) => provider.providerId)
    .includes('password');

const withEmailVerification = (Component) => {
  class WithEmailVerification extends React.Component {
    constructor(props) {
      super(props);
      this.state = { isSent: false };
    }

    onSendEmailVerification = () => {
      this.props.firebase
        .doSendEmailVerification()
        .then(() => this.setState({ isSent: true }));
    };

    render() {
      return (
        <AuthUserContext.Consumer>
          {(authUser) =>
            needsEmailVerification(authUser) ? (
              <div>
                {this.state.isSent ? (
                  <p>
                    Confirmación de E-Mail enviada: Ingresá a tu correo
                    electrónico (verificá también la carpeta de Spam) para
                    encontrar el correo de confirmación. Recargá esta página una
                    vez que hayas confirmado el E-Mail.
                  </p>
                ) : (
                  <p>
                    Verificá tu E-Mail para poder tomar clases: Comprobá tu
                    casilla de E-Mail (incluída la carpeta de Spam) para
                    encontrar el correo de confirmación, o enviá otro E-Mail de
                    confirmación.
                  </p>
                )}

                <button
                  type="button"
                  onClick={this.onSendEmailVerification}
                  disabled={this.state.isSent}
                >
                  Enviar E-Mail de confirmación
                </button>
              </div>
            ) : (
              <Component {...this.props} />
            )
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return withFirebase(WithEmailVerification);
};

export default withEmailVerification;
