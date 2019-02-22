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
      this.setState({ todos: newStateArray})
    })
  }

  render() {
    return (
      <div className="App">
        <h1>Welcome to React Fire Todos</h1>
        <Dashboard
          text={this.state.text}
          todos={this.state.todos}
          handleChange={this.handleChange} 
          handleSubmit={this.handleSubmit}
          handleRemove={this.handleRemove}
        />
      </div>
    );
  }
}

export default App;
