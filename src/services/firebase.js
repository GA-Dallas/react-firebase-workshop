import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';


firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: "",
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
});

const provider = new firebase.auth.GoogleAuthProvider()
const database = firebase.database()
const auth = firebase.auth()

function login() {
    return firebase.auth().signInWithPopup(provider)
}

function logout() {
    return firebase.auth().signOut();
}

function create(ref, todo) {
    return database.ref(ref).push(todo)
}

function remove(ref, todoId) {
    return database.ref(`${ref}/${todoId}`).remove()
}


export { 
    auth, 
    login, 
    logout, 
    firebase, 
    database, 
    create,
    remove
 }