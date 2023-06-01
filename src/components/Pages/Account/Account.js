import React, { Component } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../../Firebase';
import { AuthUserContext, withAuthorization } from '../../Session/Session';
import PasswordChangeForm from '../../Shared/PasswordChange/PasswordChange';
import Navigation from '../../Shared/NavigationNon-Auth/Navigation';
import ImageCrop from './ProfilePicChange/ImageCrop';

import './account.scss';

const SIGN_IN_METHODS = [
  {
    id: 'password',
    provider: null,
    display: 'inicio con mail y contraseña',
  },
  {
    id: 'google.com',
    provider: 'googleProvider',
    displayImg:
      'https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FIcons%2FgoogleFullColorIcon.png?alt=media&token=e7c3d38a-70c7-4447-9d17-4bb8bb34603b',
    displayName: 'Google',
  },
  {
    id: 'facebook.com',
    provider: 'facebookProvider',
    displayImg:
      'https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FIcons%2FfacebookFullColorIcon.png?alt=media&token=229b2fab-c674-463b-80fd-2d946ed17ef0',
    displayName: 'Facebook',
  },
];
class AccountPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userProfilePic: '',
      editor: null,
      scaleValue: 1,
    };
  }
  componentDidMount() {}

  setEditorRef = (editor) => this.setState({ editor });

  onCrop = () => {
    const { editor } = this.state;
    if (editor !== null) {
      const url = editor.getImageScaledToCanvas().toDataURL();
      this.setState({
        userProfilePic: url,
      });

      // Guardo el base64 como File
      const fileToSave = this.dataURLtoFile(
        url,
        this.props.firebase.auth.currentUser.uid
      );
      // Guardo la imagen en la base de datos
      this.updateDBProfilePic(fileToSave);
    }
  };

  onScaleChange = (scaleChangeEvent) => {
    const scaleValue = parseFloat(scaleChangeEvent.target.value);
    this.setState({ scaleValue });
  };

  dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  profilePicChange = (fileChangeEvent) => {
    const file = fileChangeEvent.target.files[0];
    const { type } = file;
    if (
      !(type.endsWith('jpeg') || type.endsWith('png') || type.endsWith('jpg'))
    ) {
    } else {
      this.setState({
        openCropper: true,
        selectedImage: fileChangeEvent.target.files[0],
        fileUploadErrors: [],
      });
    }
  };

  updateDBProfilePic(fileToSave) {
    const storageRef = this.props.firebase.usersProfilePics(fileToSave.name);

    const task = storageRef.put(fileToSave);
    task.on(
      'state_changed',
      (snapshot) => {},
      (error) => {
        console.error(error.message);
      },
      () => {
        // Subida completa
        storageRef.getDownloadURL().then((url) => {
          // Guardo la URL del storage en el campo imgUrl del usuario
          this.props.firebase
            .user(this.props.firebase.auth.currentUser.uid)
            .update({
              imgUrl: url,
            });
          window.location.reload();
        });
      }
    );
  }

  render() {
    const { selectedImage, scaleValue } = this.state;
    return (
      <AuthUserContext.Consumer>
        {(authUser) => (
          <div className="account-container">
            <Navigation />
            <div className="top-user-container">
              <div className="img-container">
                {!selectedImage && (
                  <div className="image-container-nonchange">
                    <img src={authUser.imgUrl} alt="" />
                    <input
                      type="file"
                      name="profilePicBtn"
                      accept="image/png, image/jpeg"
                      onChange={this.profilePicChange}
                      className="btn-change-image"
                      id="file"
                    />
                    <label htmlFor="file">Cambiar imagen</label>
                  </div>
                )}
                {selectedImage && (
                  <div>
                    <ImageCrop
                      imageSrc={selectedImage}
                      setEditorRef={this.setEditorRef}
                      onCrop={this.onCrop}
                      scaleValue={scaleValue}
                      onScaleChange={this.onScaleChange}
                    />
                  </div>
                )}
              </div>
              <div className="user-information">
                <h1> {`${authUser.firstName} ${authUser.lastName}`}</h1>
                <h2> {`${authUser.email}`}</h2>
              </div>
            </div>
            <div className="down-user-container">
              <div className="change-password">
                <h2>Modificar contraseña</h2>
                <PasswordChangeForm />
              </div>
              <div className="login-management">
                <h2>Formas de inicio de sesión habilitadas</h2>
                <LoginManagement authUser={authUser} />
              </div>
            </div>
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const SocialLoginToggle = ({
  onlyOneLeft,
  isEnabled,
  signInMethod,
  onLink,
  onUnlink,
}) =>
  isEnabled ? (
    <button
      type="button"
      onClick={() => onUnlink(signInMethod.id)}
      disabled={onlyOneLeft}
    >
      Desactivar inicio con {signInMethod.displayName}
      <img src={signInMethod.displayImg} alt="" />
    </button>
  ) : (
    <button type="button" onClick={() => onLink(signInMethod.provider)}>
      Activar inicio con {signInMethod.displayName}
      <img src={signInMethod.displayImg} alt="" />
    </button>
  );

class LoginManagementBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSignInMethods: [],
      error: null,
    };
  }

  componentDidMount() {
    this.fetchSignInMethods();
  }

  fetchSignInMethods = () => {
    this.props.firebase.auth
      .fetchSignInMethodsForEmail(this.props.authUser.email)
      .then((activeSignInMethods) =>
        this.setState({ activeSignInMethods, error: null })
      )
      .catch((error) => this.setState({ error }));
  };

  onSocialLoginLink = (provider) => {
    this.props.firebase.auth.currentUser
      .linkWithPopup(this.props.firebase[provider])
      .then(this.fetchSignInMethods)
      .catch((error) => this.setState({ error }));
  };

  onUnlink = (providerId) => {
    this.props.firebase.auth.currentUser
      .unlink(providerId)
      .then(this.fetchSignInMethods)
      .catch((error) => this.setState({ error }));
  };

  onDefaultLoginLink = (password) => {
    const credential = this.props.firebase.emailAuthProvider.credential(
      this.props.authUser.email,
      password
    );
    this.props.firebase.auth.currentUser
      .linkWithCredential(credential)
      .then(this.fetchSignInMethods)
      .catch((error) => this.setState({ error }));
  };

  render() {
    const { activeSignInMethods, error } = this.state;

    return (
      <div className="methods-container">
        <p>
          Abajo tiene los tres metodos posibles para iniciar sesión con su
          cuenta. Puede tener más de un método habilitado para iniciar sesión
          (ejemplo con email/contraseña y Google); pero siempre tiene que tener
          al menos uno habilitado.
        </p>
        <ul>
          {SIGN_IN_METHODS.map((signInMethod) => {
            // Prevent deactivating all sign-in methods
            const onlyOneLeft = activeSignInMethods.length === 1;
            const isEnabled = activeSignInMethods.includes(signInMethod.id);

            return (
              <li key={signInMethod.id}>
                {signInMethod.id === 'password' ? (
                  <DefaultLoginToggle
                    onlyOneLeft={onlyOneLeft}
                    isEnabled={isEnabled}
                    signInMethod={signInMethod}
                    onLink={this.onDefaultLoginLink}
                    onUnlink={this.onUnlink}
                  />
                ) : (
                  <SocialLoginToggle
                    onlyOneLeft={onlyOneLeft}
                    isEnabled={isEnabled}
                    signInMethod={signInMethod}
                    onLink={this.onSocialLoginLink}
                    onUnlink={this.onUnlink}
                  />
                )}
              </li>
            );
          })}
        </ul>
        {error && error.message}
      </div>
    );
  }
}

class DefaultLoginToggle extends Component {
  constructor(props) {
    super(props);
    this.state = { passwordOne: '', passwordTwo: '' };
  }
  onSubmit = (event) => {
    event.preventDefault();
    this.props.onLink(this.state.passwordOne);
    this.setState({ passwordOne: '', passwordTwo: '' });
  };
  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { onlyOneLeft, isEnabled, signInMethod, onUnlink } = this.props;
    const { passwordOne, passwordTwo } = this.state;
    const isInvalid = passwordOne !== passwordTwo || passwordOne === '';
    return isEnabled ? (
      <button
        type="button"
        onClick={() => onUnlink(signInMethod.id)}
        disabled={onlyOneLeft}
      >
        Desactivar {signInMethod.display}
      </button>
    ) : (
      <form onSubmit={this.onSubmit} className="user-pass-form">
        <h3>Mail / Contraseña</h3>
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="Contraseña"
          className="form-input"
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirmar contraseña"
          className="form-input"
        />
        <button disabled={isInvalid} type="submit">
          Habilitar inicio con mail
        </button>
      </form>
    );
  }
}

const condition = (authUser) => !!authUser;

const LoginManagement = withFirebase(LoginManagementBase);

export default compose(withAuthorization(condition))(AccountPage);
