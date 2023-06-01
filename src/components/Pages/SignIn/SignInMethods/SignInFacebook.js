import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import { withFirebase } from '../../../Firebase'
import * as ROUTES from '../../../../constants/routes'
import * as ROLES from '../../../../constants/roles'

const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential'
const ERROR_MSG_ACCOUNT_EXISTS = `
Ya existe una cuenta con este mail. Pruebe ingresando sesión.
`

class SignInFacebookBase extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  onSubmit = (event) => {
    const roles = {}
    roles[ROLES.STUDENT] = ROLES.STUDENT

    this.props.firebase
      .doSignInWithFacebook()
      .then((socialAuthUser) => {
        if (socialAuthUser.additionalUserInfo.isNewUser) {
          // Create a user in Firebase Realtime Database
          return this.props.firebase.user(socialAuthUser.user.uid).set({
            firstName: socialAuthUser.additionalUserInfo.profile.first_name,
            lastName: socialAuthUser.additionalUserInfo.profile.last_name,
            imgUrl: socialAuthUser.user.photoURL,
            email: socialAuthUser.user.email,
            freeClasses: 0,
            roles,
          })
        }
      })

      .then(() => {
        this.setState({ error: null })
        this.props.history.push(ROUTES.HOME)
      })

      .catch((error) => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS
        }

        this.setState({ error })
      })

    event.preventDefault()
  }
  render() {
    const { error } = this.state
    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit" className="socials">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FIcons%2FfacebookFullColorIcon.png?alt=media&token=229b2fab-c674-463b-80fd-2d946ed17ef0"
            alt="google"
          ></img>
        </button>
        {error && <p className="user-pass-error facebook">{error.message}</p>}
      </form>
    )
  }
}

const SignInFacebook = compose(withRouter, withFirebase)(SignInFacebookBase)

export default SignInFacebook
