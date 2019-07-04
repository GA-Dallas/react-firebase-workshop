import React, { Component } from 'react';
import { firebase, database, provider } from './services/firebase';

import Main from './components/Main/Main';
import Login from './components/Login/Login';

import './App.css';

class App extends Component {
  state = {
    isLoggedIn: false,
    userId: null,
    text: "",
    todos: []
  };

   handleChange = e => {
    this.setState({[e.target.name]: e.target.value })
   };

   handleSubmit = e => {
    e.preventDefault();
    const newState = [...this.state.todos, {text: this.state.text}];
    this.setState({todos: newState, text: ""});
   };

   handleLogin = () => {
    firebase.auth().signInWithPopup(provider)
    .then(result => {
      console.log('Signin Successful');
    })
   };

  render() {
    const { isLoggedIn } = this.state;
    return (
      <div className="App">
        {
          isLoggedIn ? 
          <Main 
          text={this.state.text}
          todos={this.state.todos}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          />
          :
          <Login />
        }
      </div>
    );
  }
}

export default App;
