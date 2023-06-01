import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';

import { withFirebase } from '../../../Firebase';
import * as ROUTES from '../../../../constants/routes';
import { getUsersForAdmin } from '../../../Firebase/Queries/users';

import Table from 'react-bootstrap/Table';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import ReactPaginate from 'react-paginate';

class UserListBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
      usersListFragments: [],
      perPage: 10,
      currentPage: 0,
    };
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  componentDidMount() {
    this.receivedData();
  }

  async receivedData() {
    this.setState({ loading: false });
    // prettier-ignore
    const { usersListResponseDataSliced, pageCount, error } = await getUsersForAdmin(
      this.state.offset,
      this.state.perPage,
    )
    if (usersListResponseDataSliced) {
      const usersListFragments = usersListResponseDataSliced.map((user) => (
        <React.Fragment key={user.uid}>
          <tr>
            <th>{`${
              user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)
            } ${
              user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)
            }`}</th>
            <th>
              <img src={user.imgUrl} alt="profile pic" />
            </th>
            <th>
              <Link to={`${ROUTES.ADMIN}/users/${user.uid}`}>
                <FontAwesomeIcon icon={faInfoCircle} />
              </Link>
            </th>
          </tr>
        </React.Fragment>
      ));
      this.setState({ pageCount, usersListFragments });
    } else this.setState({ error });
  }

  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;
    // prettier-ignore
    this.setState({ currentPage: selectedPage, offset: offset }, () => {
        this.receivedData()
      },
    )
  };

  render() {
    const { loading } = this.state;
    return (
      <div className="admin-content-item">
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

        <h2 className="admin-item-title">Usuarios activos</h2>
        <div className="admin-item-content">
          <Table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Imagen</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>{this.state.usersListFragments}</tbody>
          </Table>
        </div>
        <ReactPaginate
          previousLabel={'<'}
          nextLabel={'>'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={this.state.pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageClick}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
        />
      </div>
    );
  }
}

const UserList = withFirebase(UserListBase);

export default UserList;
