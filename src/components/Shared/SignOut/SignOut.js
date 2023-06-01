import React from 'react';
import { withFirebase } from '../../Firebase';
import './signout.scss';
const SignOutButton = ({ firebase }) => (
  <button type="button" onClick={firebase.doSignOut}>
    <div className="button-signout">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FIcons%2Flogin.png?alt=media&token=f884e1a9-8e83-4a00-85a0-b566cf893837"
        alt=""
      />
      <p>Salir</p>
    </div>
  </button>
);

export default withFirebase(SignOutButton);
