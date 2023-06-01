import React, { Component } from 'react';
import { withFirebase } from '../../../Firebase';
import { Redirect } from 'react-router-dom';

import * as ROUTES from '../../../../constants/routes';

class PackItemBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pack: null,
      invalidPack: false,
      loading: false,
      redirect: false,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    try {
      this.props.firebase
        .pack(this.props.match.params.id)
        .on('value', (snapshot) => {
          const pack = snapshot.val();
          if (pack) {
            this.setState({ pack, loading: false });
          } else {
            this.setState({ pack: null, invalidPack: true, loading: false });
          }
        });
    } catch (e) {
      console.log('Error al acceder a la base de datos', e);
      this.setState({ pack: null, invalidPack: true, loading: false });
    }
  }

  componentWillUnmount() {
    this.props.firebase.pack(this.props.match.params.id).off();
  }

  handleOnClick(e) {
    e.preventDefault();
    let result = window.confirm('Are u sure `bout dat nigga?');
    if (result) {
      try {
        this.props.firebase.pack(this.props.match.params.id).remove();
        this.setState({ redirect: true });
      } catch (e) {
        console.log('Error al eliminar en la base de datos: ', e);
      }
    }
  }

  onChangeCheckbox = (event) => {
    const { pack } = this.state;
    pack.isActivePack = event.target.checked;
    this.setState({ pack });

    this.updateStatus(event.target.checked);
  };

  updateStatus(isActivePack) {
    this.props.firebase.pack(this.props.match.params.id).update({
      isActivePack,
    });
  }

  render() {
    const { pack, invalidPack, loading } = this.state;
    if (this.state.redirect) {
      return <Redirect push to={ROUTES.ADMIN} />;
    }

    return (
      <div>
        <h2>Pack:</h2>
        {invalidPack && <div>Pack invalido!</div>}
        {loading && <div>Cargando pack...</div>}
        {pack && (
          <div>
            <span>
              <strong>Precio: </strong>${pack.packPrice}
            </span>
            <br />
            <span>
              <strong>Cantidad de streams: </strong>
              {pack.streamsAvailable}
            </span>
            <br />
            <span>
              <strong>Precio por stream: </strong> {pack.pricePerStream}
            </span>
            <br />
            <span>
              <strong>Fecha y hora de creacion: </strong> {pack.startDate}
            </span>
            <br />
            <span>
              <strong>Fecha y hora de vencimiento: </strong> {pack.endDate}
            </span>
            <br />
            <label>
              <strong>Activo:</strong>
              <input
                name="isActivePack"
                type="checkbox"
                checked={pack.isActivePack}
                value={pack.isActivePack}
                onChange={this.onChangeCheckbox.bind(this)}
              />
            </label>
            <br />
            <div className="buttons-container">
              <button type="submit" onClick={this.handleOnClick.bind(this)}>
                Eliminar Pack
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const PackItem = withFirebase(PackItemBase);

export default PackItem;
