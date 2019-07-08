import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: "",
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
});

const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();
const database = firebase.database();

function login() {
    return auth.signInWithPopup(provider);
}

function logout() {
    return auth.signOut()
}

function create(ref, todo) {
    return database.ref(ref).push(todo);
}

function remove(ref, todoId) {
    return database.ref(`${ref}/${todoId}`).remove();
}

export { 
    firebase, 
    auth, 
    database, 
    login, 
    logout,
    create,
    remove 
}