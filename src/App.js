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

  handleChange = e => {
    this.setState({ text: e.currentTarget.value })
  }

  render() {
    return (
      <div className="App">
        <h1>Welcome to React Fire Todos</h1>
        <Dashboard
          text={this.state.text}
          handleChange={this.handleChange} 
        />
      </div>
    );
  }
}

export default App;
