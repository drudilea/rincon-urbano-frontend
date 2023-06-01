import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';

import { withFirebase } from '../../../Firebase';
import * as ROUTES from '../../../../constants/routes';
import { getTeachersForAdmin } from '../../../Firebase/Queries/users';

import Table from 'react-bootstrap/Table';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import ReactPaginate from 'react-paginate';

class TeacherListBase extends Component {
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
    const { usersListResponseDataSliced, pageCount, error } = await getTeachersForAdmin(
      this.state.offset,
      this.state.perPage,
    )
    if (usersListResponseDataSliced) {
      const usersListFragments = usersListResponseDataSliced.map((teacher) => (
        <React.Fragment key={teacher.uid}>
          <tr>
            <th>{`${
              teacher.firstName.charAt(0).toUpperCase() +
              teacher.firstName.slice(1)
            } ${
              teacher.lastName.charAt(0).toUpperCase() +
              teacher.lastName.slice(1)
            }`}</th>
            <th>
              <img src={teacher.imgUrl} alt="profile pic" />
            </th>
            <th>
              <Link to={`${ROUTES.ADMIN}/teachers/${teacher.uid}`}>
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

        <h2 className="admin-item-title">Profesores activos</h2>
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

const TeacherList = withFirebase(TeacherListBase);

export default TeacherList;

/*import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactLoading from 'react-loading'

import { withFirebase } from '../../../Firebase'
import * as ROUTES from '../../../../constants/routes'
import * as ROLES from '../../../../constants/roles'

class TeacherListBase extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      teachers: [],
    }
  }

  // Cuando cargo la pag traemos toda la info de la tabla users en firebase y la "mapeamos" en usersList
  componentDidMount() {
    this.setState({ loading: true })
    this.props.firebase.users().on('value', (snapshot) => {
      // TODO: Implementar try - catch
      const usersObject = snapshot.val()
      const usersList = Object.keys(usersObject).map((key) => ({
        ...usersObject[key],
        uid: key,
      }))

      // Filter userList with every object containing role-TEACHER_ROLE
      const teachersList = usersList.filter(function (user) {
        return user.roles.hasOwnProperty(ROLES.TEACHER)
      })

      this.setState({
        teachers: teachersList,
        loading: false,
      })
    })
  }

  componentWillUnmount() {
    this.props.firebase.users().off()
  }

  render() {
    const { teachers, loading } = this.state
    return (
      <div className='admin-content-item'>
        <h2 className='admin-item-title'>Teachers</h2>
        {loading && (
          <div className='loading-bubble-container'>
            <ReactLoading
              type={'spin'}
              color={'#333'}
              height={'5%'}
              width={'5%'}
            />
          </div>
        )}
        <ul>
          {teachers &&
            teachers.map((teacher) => (
              <li key={teacher.uid}>
                <span>
                  <strong>Nombre y apellido:</strong>{' '}
                  {`${teacher.firstName} ${teacher.lastName}`}
                </span>
                <br />
                <span>
                  <strong>E-Mail:</strong> {teacher.email}
                </span>
                <br />
                <span>
                  <strong>ID:</strong> {teacher.uid}
                </span>
                <br />
                <span>
                  <Link to={`${ROUTES.ADMIN}/teachers/${teacher.uid}`}>
                    Detalles
                  </Link>
                </span>
                <br />
                <br />
              </li>
            ))}
        </ul>
      </div>
    )
  }
}

const TeacherList = withFirebase(TeacherListBase)

export default TeacherList
*/
