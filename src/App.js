import React, { Component } from 'react';
import Dashboard from './components/Dashboard'
import firebase from './firebaseConfig'
import './App.css';

class App extends Component {

  state = {
    text: "",
    todos: [],
    user: null,
    isLoggedIn: false
  }

  handleChange = e => {
    this.setState({ text: e.currentTarget.value })
  }
  
  handleSubmit = e => {
    e.preventDefault()
    firebase.database().ref('todos')
    .push({ text: this.state.text })
    .then(() => {
      this.setState({ text: "" })
      console.log("Data Successfully Created")
    })
    .catch(error => console.log("Something Went Wrong: ", error))
  }
  render() {
    return (
      <div className="App">
        <h1>Welcome to React Fire Todos</h1>
        <Dashboard
          text={this.state.text}
          handleChange={this.handleChange} 
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

export default App;
