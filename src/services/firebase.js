import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyAUAYD_z0UR8-GcahchEp7wIERT5eS1J7M",
    authDomain: "react-firebase-b13b4.firebaseapp.com",
    databaseURL: "https://react-firebase-b13b4.firebaseio.com",
    projectId: "react-firebase-b13b4",
    storageBucket: "",
    messagingSenderId: "828283292013",
    appId: "1:828283292013:web:c3ef7ffd83d97d07"
};

firebase.initializeApp(config)
const database = firebase.database()
const provider = new firebase.auth.GoogleAuthProvider();

export { firebase, provider, database }