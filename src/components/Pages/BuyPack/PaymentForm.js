import React, { Component } from 'react';

import Navigation from '../../Shared/NavigationNon-Auth/Navigation';
import ReactLoading from 'react-loading';
import Cards from 'react-credit-cards';

import { compose } from 'recompose';
import { withAuthorization } from '../../Session/Session';

import './payment-form.scss';
import 'react-credit-cards/lib/styles.scss';

class PaymentForm extends Component {
  constructor(props) {
    super(props);

    this.setPaymentMethodInfo = this.setPaymentMethodInfo.bind(this);
    this.guessingPaymentMethod = this.guessingPaymentMethod.bind(this);
    this.getInstallments = this.getInstallments.bind(this);
    this.sdkResponseHandler = this.sdkResponseHandler.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      loading: true,
      submit: false,
      uid: JSON.parse(sessionStorage.getItem('authUser')).uid,
      securityCode: '',
      cardExpirationMonth: '',
      cardExpirationYear: '',
      cardholderName: '',
      cardNumber: '',
      focus: '',
    };
  }

  async componentDidMount() {
    if (!this.props.location.state?.pack)
      return this.props.history.push('/buy-packs');

    window.Mercadopago.setPublishableKey(process.env.REACT_APP_MP_PUBLIC_KEY);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packId: `${this.props.location.state.pack}` }),
    };

    try {
      await fetch('/api/pack/preference', requestOptions)
        .then((response) => response.json())
        .then((packDetails) => {
          this.setState({
            packDescription: packDetails.description,
            packPrice: packDetails.unit_price,
            packPreferenceId: packDetails.packPreferenceId,
            loading: false,
          });
        })
        .catch((e) => {
          console.log('Error en response de pack', e);
        });
    } catch (e) {
      console.log('Error en fetching de pack', e);
    }
  }

  guessingPaymentMethod(event) {
    this.handleInputChange(event);
    const bin = event.currentTarget.value;
    if (bin.length >= 6) {
      window.Mercadopago.getPaymentMethod(
        {
          bin: bin.substring(0, 6),
        },
        this.setPaymentMethodInfo
      );
    }
  }

  setPaymentMethodInfo(status, response) {
    if (status === 200) {
      const paymentMethodElement = document.getElementById('payment_method_id');
      if (paymentMethodElement) {
        paymentMethodElement.value = response[0].id;
      } else {
        const form = document.querySelector('#pay');
        const input = document.createElement('input');
        input.setAttribute('name', 'payment_method_id');
        input.setAttribute('type', 'hidden');
        input.setAttribute('value', response[0].id);
        form.appendChild(input);
      }
      this.getInstallments();
    } else {
      alert(`Método de pago no válido`);
    }
  }

  getInstallments() {
    window.Mercadopago.getInstallments(
      {
        payment_method_id: document.getElementById('payment_method_id').value,
        amount: parseFloat(document.getElementById('transaction_amount').value),
      },
      function (status, response) {
        if (status === 200) {
          document.getElementById('installments').options.length = 0;
          response[0].payer_costs.forEach((installment) => {
            let opt = document.createElement('option');
            opt.text = installment.recommended_message;
            opt.value = installment.installments;
            document.getElementById('installments').appendChild(opt);
          });
        } else {
          alert(`Error al obtener las cuotas: ${response}`);
        }
      }
    );
  }

  onSubmit(event) {
    event.preventDefault();
    if (!this.state.submit) {
      const form = document.getElementsByTagName('form')[0];
      window.Mercadopago.createToken(form, this.sdkResponseHandler);
    }
  }

  async sdkResponseHandler(status, response) {
    if (status !== 200 && status !== 201) {
      alert('Verificar datos ingresados ' + response.cause[0].description);

      this.setState({
        submit: false,
      });
    } else {
      this.setState({
        submit: true,
      });
      const form = document.querySelector('#pay');
      const card = document.createElement('input');
      card.setAttribute('name', 'token');
      card.setAttribute('type', 'hidden');
      card.setAttribute('value', response.id);
      form.appendChild(card);
      form.submit();
    }
  }

  handleInputFocus = (e) => {
    if (e.target.id === 'securityCode') {
      this.setState({ focus: 'cvc' });
    } else {
      this.setState({ focus: 'name' });
    }
  };

  handleInputChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };
  render() {
    if (JSON.parse(sessionStorage.getItem('authUser')) === null) {
      this.props.history.push('/home');
    }
    window.Mercadopago.getIdentificationTypes();
    if (this.state.loading)
      return (
        <div className="loading-bubble-container">
          <Navigation />
          <div className="loading-container">
            <ReactLoading
              type={'spin'}
              color={'#fff'}
              height={'50px'}
              width={'50px'}
            />
          </div>
        </div>
      );
    return (
      <div className="payment-page-container">
        <Navigation />
        <div className="payment-content">
          <div className="order-summary-container">
            <span className="summary-title">Detalles de la compra</span>
            <hr />
            <div className="summary-description">
              <div className="company-details">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FIcons%2FlogoCircularVerde.png?alt=media&token=29eda3c8-c5af-46a8-90ca-1060e4806a51"
                  alt=""
                  className="rincon-urbano-logo"
                />
                <span>Rincon Urbano</span>
              </div>
              <div className="order-details">
                <span className="order-description">
                  {this.state.packDescription}
                </span>
                <span className="order-price">$ {this.state.packPrice}</span>
              </div>
            </div>
          </div>
          <div className="payment-form-container">
            <form
              id="pay"
              name="pay"
              action="/api/mp/procesar_pago"
              method="POST"
              onSubmit={this.onSubmit}
            >
              <fieldset>
                <input
                  type="hidden"
                  name="description"
                  id="description"
                  value={this.state.packDescription}
                />
                <input
                  type="hidden"
                  name="transaction_amount"
                  id="transaction_amount"
                  value={this.state.packPrice}
                />
                <div className="form-input-container">
                  <label htmlFor="email">Email:</label>
                  <input
                    id="email"
                    name="email"
                    placeholder="juan_perez@gmail.com"
                    type="email"
                    className="form-input"
                    autoComplete="none"
                  />
                </div>

                <div className="form-input-container">
                  <label htmlFor="cardNumber">Número de tarjeta:</label>
                  <input
                    type="text"
                    id="cardNumber"
                    data-checkout="cardNumber"
                    autoComplete="none"
                    placeholder="4509953566233704"
                    pattern="[\d| ]{16,22}"
                    onChange={this.guessingPaymentMethod}
                    onFocus={this.handleInputFocus}
                    className="form-input"
                  />
                </div>

                <div className="form-input-container">
                  <label htmlFor="cardExpirationMonth">
                    Fecha de vencimiento:
                  </label>
                  <div className="expiration-date">
                    <input
                      type="text"
                      id="cardExpirationMonth"
                      data-checkout="cardExpirationMonth"
                      placeholder="12"
                      autoComplete="none"
                      className="form-input month"
                      onChange={this.handleInputChange}
                      onFocus={this.handleInputFocus}
                    />
                    <input
                      type="text"
                      id="cardExpirationYear"
                      data-checkout="cardExpirationYear"
                      placeholder="2020"
                      autoComplete="none"
                      className="form-input year"
                      onChange={this.handleInputChange}
                      onFocus={this.handleInputFocus}
                    />
                  </div>
                </div>

                <div className="form-input-container">
                  <label htmlFor="cardholderName">Titular de la tarjeta:</label>
                  <input
                    type="text"
                    id="cardholderName"
                    data-checkout="cardholderName"
                    placeholder="Juan Perez"
                    className="form-input"
                    onChange={this.handleInputChange}
                    onFocus={this.handleInputFocus}
                  />
                </div>

                <div className="form-input-container">
                  <label htmlFor="securityCode">Código de seguridad:</label>
                  <input
                    type="password"
                    id="securityCode"
                    data-checkout="securityCode"
                    placeholder="123"
                    autoComplete="none"
                    className="form-input"
                    onChange={this.handleInputChange}
                    onFocus={this.handleInputFocus}
                  />
                </div>

                <div className="form-input-container">
                  <label htmlFor="installments">Cuotas:</label>
                  <select
                    id="installments"
                    className="form-input"
                    name="installments"
                    required
                  ></select>
                </div>

                <div className="form-input-container">
                  <label htmlFor="docType">Tipo de documento:</label>
                  <select
                    id="docType"
                    data-checkout="docType"
                    className="form-input"
                  ></select>
                </div>

                <div className="form-input-container">
                  <label htmlFor="docNumber">Número de documento:</label>
                  <input
                    type="text"
                    id="docNumber"
                    data-checkout="docNumber"
                    placeholder="12345678"
                    className="form-input"
                  />
                </div>
                <input
                  type="hidden"
                  name="payment_method_id"
                  id="payment_method_id"
                />
                <input
                  type="hidden"
                  name="uid"
                  id="uid"
                  value={this.state.uid}
                />
                <input
                  type="hidden"
                  name="preference_id"
                  id="preference_id"
                  value={this.state.packPreferenceId}
                />

                <div className="pay-button-container">
                  <input type="submit" value="Pagar" className="pay-button" />
                </div>
              </fieldset>
            </form>
            <div className="card-container">
              <Cards
                cvc={this.state.securityCode}
                expiry={
                  this.state.cardExpirationMonth + this.state.cardExpirationYear
                }
                focused={this.state.focus}
                name={this.state.cardholderName}
                number={this.state.cardNumber}
                preview={true}
                placeholders={{ name: 'JUAN PEREZ' }}
                className="card-animation"
              />
              <div className="payment-methods-container">
                <span className="payment-methods-text">
                  Para otros medios de pago o cualquier otra consulta,
                  escribinos mediante el siguiente link o escaneando el codigo
                  QR:
                </span>
                <a
                  href="http://wa.link/vqwhto"
                  className="payment-mehthods-wppContainer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Consultar
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FIcons%2FWhite%20whatsapp%20%5Blogo%5D%20-%20contact.png?alt=media&token=af9e1573-3aa3-4c3f-bedd-8c957011344a"
                    alt="logoWhatsapp"
                    className="payment-mehthods-wppLogo"
                  />
                </a>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FIcons%2Fwa.link_vqwhto.png?alt=media&token=058cea47-996e-40a2-af7f-9d3747eae593"
                  alt=""
                  className="payment-mehthods-qrCode"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const condition = (authUser) => !!authUser;
export default compose(withAuthorization(condition))(PaymentForm);
