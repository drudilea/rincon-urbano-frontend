import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import { withFirebase } from '../../../Firebase'
import * as ROUTES from '../../../../constants/routes'
import * as ROLES from '../../../../constants/roles'

const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential'
const ERROR_MSG_ACCOUNT_EXISTS = `
An account with an E-Mail address to this social account already exists. Try to login from this account instead and associate your social accounts on your personal account page.
`

class SignInGoogleBase extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  onSubmit = (event) => {
    const roles = {}
    roles[ROLES.STUDENT] = ROLES.STUDENT

    this.props.firebase
      .doSignInWithGoogle()
      .then((socialAuthUser) => {
        if (socialAuthUser.additionalUserInfo.isNewUser) {
          // Create a user in Firebase Realtime Database
          return this.props.firebase.user(socialAuthUser.user.uid).set({
            firstName: socialAuthUser.additionalUserInfo.profile.given_name,
            lastName: socialAuthUser.additionalUserInfo.profile.family_name,
            imgUrl: socialAuthUser.additionalUserInfo.profile.picture,
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
            src="https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FIcons%2FgoogleFullColorIcon.png?alt=media&token=e7c3d38a-70c7-4447-9d17-4bb8bb34603b"
            alt="google"
          ></img>
        </button>
        {error && <p className="user-pass-error google">{error.message}</p>}
      </form>
    )
  }
}

const SignInGoogle = compose(withRouter, withFirebase)(SignInGoogleBase)

export default SignInGoogle
