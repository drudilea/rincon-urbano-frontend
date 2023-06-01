/*
For a well-encapsulated Firebase module, we define a index.js that exports all necessary functionalities (Firebase class, Firebase context for Consumer and Provider components):
*/

import FirebaseContext, { withFirebase } from './context';
import Firebase from './firebase';

export default Firebase;

export { FirebaseContext, withFirebase };
