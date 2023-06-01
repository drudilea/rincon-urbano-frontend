import React, { Component } from 'react';
import { withFirebase } from '../../../Firebase';
import './packs.scss';

const INITIAL_STATE = {
  streamsAvailable: '',
  packPrice: '',
  // startDate: new Date(),
  // endDate: new Date(),
  isActivePack: true,
};

class PackCreateBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
    };
  }

  onSubmitHandler = (e) => {
    e.preventDefault();

    const { streamsAvailable, packPrice, isActivePack } = this.state;

    const pack = {
      streamsAvailable,
      packPrice,
      pricePerStream: packPrice / streamsAvailable,
      isActivePack,
    };

    let preference = {
      binary_mode: true,
      items: [
        {
          title: `Pack de ${streamsAvailable} clase/s en Rincon Urbano`,
          description: `Pack de ${streamsAvailable} clase/s en Rincon Urbano`,
          quantity: 1,
          unit_price: packPrice,
          currency_id: 'ARS',
        },
      ],

      back_urls: {
        success: 'rinconurbano.club/home',
        failure: 'rinconurbano.club/buy-packs',
        pending: '',
      },

      auto_return: 'approved',

      payment_methods: {
        excluded_payment_types: [{ id: 'ticket' }, { id: 'atm' }],
      },
    };

    const requestOptionsMP = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preference),
    };

    const TEST_TOKEN = process.env.REACT_APP_MP_ACCESS_TOKEN;
    fetch(
      `https://api.mercadopago.com/checkout/preferences?access_token=${TEST_TOKEN}`,
      requestOptionsMP
    )
      .then((response) => response.json())
      .then((data) => {
        pack.idMP = data.id;
        pack.back_urls = data.back_urls;
        pack.createdDate = data.date_created;

        // Guardo en base de datos el pack
        this.props.firebase.packs().push(pack);
      });

    // Una vez guardado reinicio el formulario
    this.setState({ ...INITIAL_STATE });
  };

  onChangeNumber = (event) => {
    this.setState({ [event.target.name]: event.target.valueAsNumber });
  };

  onChangeStartDate = (event) => {
    this.setState({ startDate: event });
  };

  onChangeEndDate = (event) => {
    this.setState({ endDate: event });
  };

  onChangeCheckbox = (event) => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    const { streamsAvailable, packPrice, isActivePack } = this.state;

    return (
      <div className="create-pack-container">
        <h1>Crear Pack</h1>
        <form
          method="post"
          action="submit"
          className="pack-create-form"
          onSubmit={this.onSubmitHandler}
        >
          <label id="streamsAvailable">
            <strong>Cantidad de clases: </strong>
            <input
              type="number"
              name="streamsAvailable"
              onChange={this.onChangeNumber}
              id=""
              value={streamsAvailable}
              required
            />
          </label>

          <label id="packPrice">
            <strong>Precio del pack: </strong>
            <input
              type="number"
              name="packPrice"
              id=""
              onChange={this.onChangeNumber}
              value={packPrice}
              required
            />
          </label>

          <label id="isActivePack">
            <strong>Pack activo:</strong>
            <input
              name="isActivePack"
              type="checkbox"
              checked={isActivePack}
              onChange={this.onChangeCheckbox}
            />
          </label>

          <button type="submit">Crear Pack</button>
        </form>
      </div>
    );
  }
}

const PackCreate = withFirebase(PackCreateBase);

export default PackCreate;
