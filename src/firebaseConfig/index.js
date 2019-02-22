import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'


const config = {
    apiKey: "AIzaSyAPQ6im4JJ2BC_2rjfChki2Nr4v1DOsrk4",
    authDomain: "react-fire-todos-app.firebaseapp.com",
    databaseURL: "https://react-fire-todos-app.firebaseio.com",
    projectId: "react-fire-todos-app",
    storageBucket: "react-fire-todos-app.appspot.com",
    messagingSenderId: "759605600158"
};

firebase.initializeApp(config)

export default firebase