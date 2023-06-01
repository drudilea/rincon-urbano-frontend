import React from 'react'

import { Switch, Route } from 'react-router-dom'

import { compose } from 'recompose'

import { withAuthorization } from '../../Session/Session'

import * as ROLES from '../../../constants/roles'
import * as ROUTES from '../../../constants/routes'
import UserList from './User/UserList'
import UserItem from './User/UserItem'
import TeacherList from './Teacher/TeacherList'
import TeacherItem from './Teacher/TeacherItem'
import StreamList from './Stream/StreamList'
import StreamItem from './Stream/StreamItem'
import StreamHistory from './Stream/StreamHistory'
import StreamCreate from './Stream/StreamCreate'
import PackList from './Pack/PackList'
import PackItem from './Pack/PackItem'
import PackHistory from './Pack/PackHistory'
import PackCreate from './Pack/PackCreate'
import PaymentCreate from './Payment/PaymentCreate'
import Navigation from '../../Shared/NavigationNon-Auth/Navigation'

import './admin.scss'

const AdminPage = () => (
  <div>
    <Navigation />

    <Switch>
      <Route exact path={ROUTES.ADMIN_USERS} component={UserItem} />

      <Route exact path={ROUTES.ADMIN_TEACHERS} component={TeacherItem} />

      <Route exact path={ROUTES.ADMIN_STREAM} component={StreamItem} />

      <Route path={ROUTES.STREAM_HISTORY} component={StreamHistory} />

      <Route path={ROUTES.STREAM_CREATE} component={StreamCreate} />

      <Route path={ROUTES.ADMIN_PACK} component={PackItem} />

      <Route path={ROUTES.PACK_HISTORY} component={PackHistory} />

      <Route path={ROUTES.PACK_CREATE} component={PackCreate} />

      <React.Fragment>
        <div className='admin-content-container'>
          <Route exact path={ROUTES.ADMIN} component={StreamList} />
          <Route exact path={ROUTES.ADMIN} component={PackList} />
          <Route exact path={ROUTES.ADMIN} component={UserList} />
          <Route exact path={ROUTES.ADMIN} component={TeacherList} />
          <Route exact path={ROUTES.ADMIN} component={PaymentCreate} />
        </div>
      </React.Fragment>
    </Switch>
  </div>
)

const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN]

export default compose(withAuthorization(condition))(AdminPage)
