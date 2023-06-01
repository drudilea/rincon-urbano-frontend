import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';

import { withFirebase } from '../../../Firebase';
import * as ROUTES from '../../../../constants/routes';
import { getAllActivePacks } from '../../../Firebase/Queries/packs';

import Table from 'react-bootstrap/Table';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

class PackListBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      activePacks: [],
    };
  }

  async componentDidMount() {
    this.setState({ loading: true });
    const packsResponse = await getAllActivePacks();
    if (packsResponse?.status === 200)
      this.setState({ activePacks: packsResponse.data, loading: false });
    else this.setState({ error: packsResponse.error, loading: false });
  }

  render() {
    const { loading, activePacks } = this.state;
    return (
      <div className="admin-content-item">
        <h2 className="admin-item-title">Packs activos</h2>
        {loading && (
          <div className="loading-bubble-container">
            <ReactLoading
              type={'spin'}
              color={'#333'}
              height={'5%'}
              width={'5%'}
            />
          </div>
        )}
        {!loading && (
          <div className="admin-item-content">
            <Table>
              <thead>
                <tr>
                  <th>Clases disponibles</th>
                  <th>Precio</th>
                  <th>Precio por clase</th>
                  <th>Detalles</th>
                </tr>
              </thead>
              <tbody>
                {activePacks &&
                  activePacks.map((pack) => (
                    <tr key={pack.uid}>
                      <th>{pack.streamsAvailable}</th>
                      <th>{`$${pack.packPrice}`}</th>
                      <th>{`$${pack.pricePerStream}`}</th>
                      <th>
                        <Link to={`${ROUTES.ADMIN}/pack/${pack.uid}`}>
                          <FontAwesomeIcon icon={faInfoCircle} />
                        </Link>
                      </th>
                    </tr>
                  ))}
              </tbody>
            </Table>

            <div className="admin-item-button-container">
              <Link to={`${ROUTES.PACK_CREATE}`}>
                <button className="admin-item-button">Agregar pack</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const PackList = withFirebase(PackListBase);

export default PackList;
