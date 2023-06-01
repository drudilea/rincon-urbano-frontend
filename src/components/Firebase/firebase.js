import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    //app.analytics();
    this.emailAuthProvider = app.auth.EmailAuthProvider;
    this.auth = app.auth();
    this.db = app.database();
    this.storage = app.storage();

    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.facebookProvider = new app.auth.FacebookAuthProvider();
  }

  // ====================================
  // *** Auth API ***
  // ====================================

  // Creating user with email and pass
  doCreateUserWithEmailAndPassword = function (email, password) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  };

  // User signin in with email and pass
  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  // User signin in with Google
  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

  // User signin in with Facebook
  doSignInWithFacebook = () => this.auth.signInWithPopup(this.facebookProvider);

  // Signing out doesn't require any parameters
  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = (password) =>
    this.auth.currentUser.updatePassword(password);

  // Merge Auth and DB User API
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        this.user(authUser.uid)
          .once('value')
          .then((snapshot) => {
            const dbUser = snapshot.val();
            // Default empty roles
            // if (!dbUser.roles) {
            //   dbUser.roles = {};
            // }
            // Merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              ...dbUser,
            };
            next(authUser);
          });
      } else {
        fallback();
      }
    });

  doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({
      url: 'https://www.rinconurbano.club/home',
    });

  // ====================================
  // *** User API ***
  // ====================================
  user = (uid) => this.db.ref(`users/${uid}`);
  users = () => this.db.ref('users');

  // ====================================
  // *** Streams API ***
  // ====================================
  stream = (sid) => this.db.ref(`streams/${sid}`);
  streams = () => this.db.ref('streams');

  // ====================================
  // *** Packs API ***
  // ====================================
  pack = (pid) => this.db.ref(`packs/${pid}`);
  packs = () => this.db.ref('packs');

  // ====================================
  // *** User Packs API ***
  // ====================================
  userpack = (pid) => this.db.ref(`user-packs/${pid}`);
  userpacks = () => this.db.ref('user-packs');

  // ====================================
  // *** User Profile Pictures API ***
  // ====================================
  usersProfilePics = (filename) =>
    this.storage.ref(`web-images/usersProfilePics/${filename}`);
}
export default Firebase;
