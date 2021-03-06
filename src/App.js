import React, { Component } from 'react';
import Dashboard from './components/DashBoard/Dashboard'
import Login from './components/Login/Login'
import firebase from './firebaseConfig'
import './App.css';

class App extends Component {

  state = {
    text: "",
    todos: [],
    user: null,
    isAuthenticated: false
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
  
  handleSubmit = e => {
    e.preventDefault()
    firebase.database().ref('todos')
    .push({ text: this.state.text })
    .then(() => {
      this.setState({ text: "" })
      console.log("Data Created Successfully")
    })
    .catch(error => console.log("Something Went Wrong: ", error))
  }

  handleRemove = todoId => {
    firebase.database().ref(`todos/${todoId}`)
    .remove()
    .then(() => console.log("Data Removed Successfully"))
    .catch(error => console.log("Something Went Wrong", error))
  }

  handleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(result => {
      console.log(result.user.displayName)
      console.log("User Logged In Successfully")
    })
    .catch(error => {
      console.log("Something Went Wrong: ", error.message)
    })
  }

  handleLogout = () => {
    firebase.auth().signOut()
    .then(() => {
      console.log("User Logged Out Successfully")
    })
    .catch(error => {
      console.log("Something Went Wrong: ", error.message)
    })
  }

  componentDidMount(){
    firebase.database().ref('todos')
    .on('value', snapshot => {
      const newStateArray = []
      snapshot.forEach(childSnapshot => {
        newStateArray.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        })
      })
      this.setState({ todos: newStateArray })
    })
    firebase.auth().onAuthStateChanged(firebaseUser => {
      firebaseUser ?
        this.setState({
          user: firebaseUser.displayName,
          isAuthenticated: true
        })
        :
        this.setState({
          user: null,
          isAuthenticated: false
        })
    })
  }

  render() {
    return (
      <div className="App">
        <h1>Welcome to React Fire Todos</h1>
        {
          this.state.isAuthenticated ? 
            <Dashboard
              text={this.state.text}
              todos={this.state.todos}
              handleChange={this.handleChange} 
              handleSubmit={this.handleSubmit}
              handleRemove={this.handleRemove}
              handleLogout={this.handleLogout}
            />
           : 
            <Login 
            handleLogin={this.handleLogin}
            />
        }
      </div>
    );
  }
}

export default App;
