import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../../../Firebase';

import * as ROUTES from '../../../../constants/routes';

import { getAllActivePacks } from '../../../Firebase/Queries/packs';
import { getUserInfoFromEmail } from '../../../Firebase/Queries/users';
import { postManualPayment } from '../../../Firebase/Queries/payments';

import Table from 'react-bootstrap/Table';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

class PaymentCreateBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      user: null,
      description: '',
      preferences: [],
      userNotFound: false,
    };
  }

  async componentDidMount() {
    const packsResponse = await getAllActivePacks();
    if (packsResponse?.status === 200)
      this.setState({ preferences: packsResponse.data, userNotFound: false });
  }

  onSubmitEmail = async (event) => {
    event.preventDefault();

    const userResponse = await getUserInfoFromEmail(this.state.email);
    if (userResponse?.status === 200) {
      const user = Object.keys(userResponse.data).map((key) => ({
        ...userResponse.data[key],
        uid: key,
      }));
      this.setState({ user: user[0], userNotFound: false });
    } else {
      this.setState({ email: '', user: null, userNotFound: true });
      console.log(
        'Error al buscar un usuario con el email especificado',
        userResponse.error
      );
    }
  };

  onSubmitPayment = async (event) => {
    event.preventDefault();
    const body = {};
    const labels = document.querySelectorAll('label');

    // Guardo todos los campos del formulario
    labels.forEach((label) => (body[label.id] = label.control.value));
    const paymentResponse = await postManualPayment(body);
    if (paymentResponse.status === 200) {
      this.setState({ description: '' });
    } else {
      this.resetForm();
      console.log('Error al crear el pago', paymentResponse.error);
    }
  };

  onChangeEmail = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeDescription = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  resetForm() {
    this.setState({ user: null, email: '' });
  }

  render() {
    const { email, user, description, preferences, userNotFound } = this.state;

    return (
      <div className="admin-content-item">
        <h2 className="admin-item-title">Agregar pago personalizado</h2>
        <form method="post" action="submit" onSubmit={this.onSubmitEmail}>
          <label id="email">
            <strong>Email del usuario: </strong>
            <input
              type="email"
              name="email"
              onChange={this.onChangeEmail}
              id=""
              value={email}
              required
              placeholder="Mail del usuario"
            />
          </label>
          {userNotFound && (
            <div>
              <span>No existe un usuario para este email</span>
            </div>
          )}
          <button type="submit">Buscar</button>
        </form>

        {user && (
          <div>
            <div className="admin-item-content">
              <Table>
                <thead>
                  <tr>
                    <th>Nombre del usuario</th>
                    <th>Imagen</th>
                    <th>Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={user.uid}>
                    <th>
                      {user.firstName} {user.lastName}
                    </th>
                    <th>
                      <img src={user.imgUrl} alt="userImg" />
                    </th>
                    <th>
                      <Link to={`${ROUTES.ADMIN}/users/${user.uid}`}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                      </Link>
                    </th>
                  </tr>
                </tbody>
              </Table>
            </div>

            <form
              method="post"
              action="submit"
              onSubmit={this.onSubmitPayment}
              className="add-payment-form"
            >
              <label id="preference_id">
                <strong>Pack: </strong>
                <select name="" id="">
                  {preferences.map((preference) => (
                    <option
                      key={preference.idMP}
                      value={preference.idMP}
                    >{`Precio $${preference.packPrice} - Clases ${preference.streamsAvailable}`}</option>
                  ))}
                </select>
              </label>
              <label id="description">
                <strong>Descripción: </strong>
                <input
                  type="text"
                  name="description"
                  onChange={this.onChangeDescription}
                  id=""
                  value={description}
                  required
                />
              </label>
              <label id="uid">
                <strong>Id usuario: </strong>
                <input
                  type="text"
                  name="uid"
                  id=""
                  value={user.uid}
                  required
                  readOnly
                  disabled
                />
              </label>
              <br />
              <button type="submit">Agregar pago</button>
            </form>
          </div>
        )}
      </div>
    );
  }
}

const PaymentCreate = withFirebase(PaymentCreateBase);

export default PaymentCreate;
