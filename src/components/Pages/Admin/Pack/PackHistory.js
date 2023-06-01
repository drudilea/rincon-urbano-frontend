import React, { Component } from 'react';
import { withFirebase } from '../../../Firebase/';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../../constants/routes';

class PackHistoryBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      allPacks: null,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    // Obtengo todos los packs
    this.props.firebase.packs().on('value', (snapshot) => {
      let packsList;
      try {
        const packsObject = snapshot.val();
        packsList = Object.keys(packsObject).map((key) => ({
          ...packsObject[key],
          uid: key,
        }));
      } catch (e) {
        console.log('Error fetching packs history ', e);
      } finally {
        this.setState({
          allPacks: packsList,
          loading: false,
        });
      }
    });
  }

  componentWillUnmount() {
    this.props.firebase.packs().off();
  }
  render() {
    const { loading, allPacks } = this.state;

    return (
      <div>
        <h2>Historial de packs:</h2>
        {loading && <div>Cargando packs...</div>}
        {allPacks && (
          <div>
            <ul>
              {allPacks.map((pack) => (
                <li key={pack.uid}>
                  <span>
                    <strong>Pack ID:</strong> {pack.uid}
                  </span>
                  <br />
                  <span>
                    <strong>Precio del pack: </strong> ${pack.packPrice}
                  </span>
                  <br />
                  <span>
                    <strong>Cantidad de streams: </strong>
                    {pack.streamsAvailable}
                  </span>
                  <br />
                  <span>
                    <strong>Precio por stream: </strong> ${pack.pricePerStream}
                  </span>
                  <br />
                  <span>
                    <strong>Fecha de creacion:</strong>
                    {pack.startDate}
                  </span>
                  <br />
                  <span>
                    <strong>Fecha de vencimiento:</strong>
                    {pack.endDate}
                  </span>
                  <br />
                  <span>
                    <strong>Activo:</strong>
                    <input
                      name="isActivePack"
                      type="checkbox"
                      checked={pack.isActivePack}
                      readOnly
                    />
                  </span>
                  <br />
                  <Link to={`${ROUTES.ADMIN}/pack/${pack.uid}`}>
                    Modificar pack
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

const PackHistory = withFirebase(PackHistoryBase);

export default PackHistory;
