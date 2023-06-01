import React, { Component } from 'react';
import { withFirebase } from '../../Firebase';
import ReactLoading from 'react-loading';

import * as ROUTES from '../../../constants/routes';
import './buy-packs.scss';
import { Link } from 'react-router-dom';

class PacksBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      packsList: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    try {
      this.props.firebase
        .packs()
        .orderByChild('isActivePack')
        .equalTo(true)
        .on('value', (snapshot) => {
          const packsObject = snapshot.val();
          if (packsObject) {
            const packsList = Object.keys(packsObject).map((key) => ({
              ...packsObject[key],
              uid: key,
            }));
            this.setState({ packsList, loading: false });
          } else {
            this.setState({ packsList: null, loading: false });
          }
        });
    } catch (e) {
      console.log('Error fetching active packs ', e);
      this.setState({
        loading: false,
      });
    }
  }

  componentWillUnmount() {
    this.props.firebase.packs().off();
  }

  render() {
    const { packsList, loading } = this.state;
    return (
      <div>
        {loading && (
          <div className="loading">
            <ReactLoading
              type={'spin'}
              color={'#fff'}
              height={'50px'}
              width={'50px'}
            />
          </div>
        )}
        <div className="packs-list-container">
          {!packsList ? (
            <p>No hay packs activos en el dia de hoy</p>
          ) : (
            packsList.map((pack) => (
              <div className="pack-item" key={pack.uid}>
                <span className="streams-qty">
                  Pack de {pack.streamsAvailable}{' '}
                  {pack.streamsAvailable > 1 ? 'clases' : 'clase'}
                </span>
                <span className="streams-price">$ {pack.packPrice}</span>
                <span className="individual-stream-price">
                  (${pack.pricePerStream} por clase)
                </span>
                <Link
                  to={{
                    pathname: `${ROUTES.PAYMENT_FORM}`,
                    state: { pack: pack.uid },
                  }}
                >
                  <button>Comprar pack</button>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
}

const Packs = withFirebase(PacksBase);
export default Packs;
