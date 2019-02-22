import React, { Component } from 'react';
import Dashboard from './components/Dashboard'
import './App.css';

class App extends Component {

  state = {
    text: "",
    todos: [],
    user: null,
    isLoggedIn: false
  }

  render() {
    return (
      <div className="App">
        <h1>Welcome to React Fire Todos</h1>
        <Dashboard />
      </div>
    );
  }
}

export default App;
