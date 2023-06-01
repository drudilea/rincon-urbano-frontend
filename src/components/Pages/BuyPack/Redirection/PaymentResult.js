import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import queryString from 'query-string';

import * as ROUTES from '../../../../constants/routes';
import { compose } from 'recompose';
import { withAuthorization } from '../../../Session/Session';
import Navigation from '../../../Shared/NavigationNon-Auth/Navigation';

import imgApproved from '../../../../resources/icons/check.svg';
import imgRejected from '../../../../resources/icons/cross.svg';

import './payment-result.scss';

export class PaymentResult extends Component {
  constructor(props) {
    super(props);
    const queryValues = queryString.parse(this.props.location.search);
    this.state = {
      status: queryValues.status,
      status_detail: queryValues.status_detail,
      approved: null,
      image: null,
      message: null,
    };
  }

  componentDidMount() {
    // if (!this.state.status) return this.props.history.push('/home');

    this.paymentStatus();
  }

  paymentStatus() {
    if (this.state.status === 'approved') {
      this.approvedPayment();
    } else if (this.state.status === 'rejected') {
      this.rejectionMessageHandler();
    }
  }

  rejectionMessageHandler() {
    let message;
    switch (this.state.status_detail) {
      case 'cc_rejected_bad_filled_card_number':
        message =
          'Tu pago no fue acreditado. Revisa el número de la tarjeta cargado.';
        break;
      case 'cc_rejected_bad_filled_date':
        message =
          'Tu pago no fue acreditado. Revisa la fecha de vencimiento cargada.';
        break;
      case 'cc_rejected_bad_filled_other':
        message = 'Tu pago no fue acreditado. Revisa los datos cargados.';
        break;
      case 'cc_rejected_bad_filled_security_code':
        message =
          'Tu pago no fue acreditado. Revisa el código de seguridad de la tarjeta cargado.';
        break;
      case 'cc_rejected_blacklist':
        message = 'No pudimos procesar tu pago.';
        break;
      case 'cc_rejected_call_for_authorize':
        message =
          'Tu pago no fue acreditado. Debes autorizar el pago con tu banco.';
        break;
      case 'cc_rejected_card_disabled':
        message =
          'Tu pago no fue acreditado. Llama a tu banco para activar tu tarjeta o probá con otra distinta.';
        break;
      case 'cc_rejected_card_error':
        message = 'No pudimos procesar tu pago.';
        break;
      case 'cc_rejected_duplicated_payment':
        message =
          'Tu pago no fue acreditado. Ya hiciste un pago por ese valor. Si necesitas volver a pagar probá con otra tarjeta.';
        break;
      case 'cc_rejected_high_risk':
        message = 'Tu pago fue rechazado. Probá con otra tarjeta distinta.';
        break;
      case 'cc_rejected_insufficient_amount':
        message =
          'Tu pago no fue acreditado. La tarjeta no tiene fondos suficientes para realizar este pago.';
        break;
      case 'cc_rejected_invalid_installments':
        message =
          'Tu pago no fue acreditado. Tu banco no procesa pagos en las cuotas que seleccionaste.';
        break;
      case 'cc_rejected_max_attempts':
        message =
          'Tu pago no fue acrediclassName="payment-result-buttontado. Llegaste al límite de intentos permitidos. Te recomendamos usar otra tarjeta.';
        break;
      case 'cc_rejected_other_reason':
        message = 'Tu tarjeta no pudo procesar el pago.';
        break;
      default:
        message =
          'No pudimos procesar tu pago. Contactate con nosotros a través de nuestras redes sociales.';
    }

    this.setState({
      image: imgRejected,
      approved: false,
      message: message,
    });
  }

  approvedPayment() {
    this.setState({
      image: imgApproved,
      approved: true,
      message:
        '¡Listo! Se acreditó tu pago. En la sección Mi Cuenta vas a ver las clases acreditadas.',
    });
  }

  render() {
    return (
      <div className="payment-result-page">
        <Navigation />
        <div className="payment-result-container">
          <div className="payment-result-content">
            {this.state.image && (
              <div className="payment-result-image-container">
                <img
                  src={this.state.image}
                  alt="payment-approved"
                  className="payment-result-image"
                />
              </div>
            )}
            {this.state.message && (
              <div className="payment-result-message-container">
                <span className="payment-result-message">
                  {this.state.message}
                </span>
              </div>
            )}

            <div className="payment-result-buttons-container">
              <Link to={`${ROUTES.HOME}`}>
                <button className="payment-result-button">
                  Volver al inicio
                </button>
              </Link>

              {!this.state.approved && (
                <Link to={`${ROUTES.BUY_PACK}`}>
                  <button className="payment-result-button">
                    Elegir otro pack
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const condition = (authUser) => !!authUser;
export default compose(withAuthorization(condition))(PaymentResult);
