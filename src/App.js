import React, { Component } from 'react';
import './App.css';

import {
  BrowserRouter as Router, 
  Switch, 
  Redirect,
  withRouter, 
  Route, 
  Link } from 'react-router-dom'

import {
  login, 
  auth, 
  logout, 
  create,
  remove,
  database } from './services/firebase';

const linkStyles = {
  cursor: 'pointer',
  textDecoration: 'underline',
  color: 'purple'
}


// Create Private Route

function PrivateRoute({authenticated, component: Component, ...rest}) {
  return(
    <Route {...rest} render={props => (
      authenticated
      ? <Component {...rest} {...props} />
      : <Redirect to="/Login" />
    )}/>
  )
}

// Here's out components
function Home() {
  return(
    <div>
      <h1>Welcome to React Firebase Todos</h1>
    </div>
  )
}

function Login({authenticated }) {
  if(authenticated) return <Redirect to="/dashboard" />
  return(
    <div>
      <h1>You Must Be Logged in to See this Page</h1>
      <button onClick={login}>Login With Google</button>
    </div>
  )
}

function Dashboard({
  user,
  todos, 
  text, 
  handleSubmit, 
  handleChange,
  handleRemove}) {
  return(
    <div>
      <img
      style={{height: 150, borderRadius: '50%'}} 
      src={user.photoURL} alt={user.displayName} />
      <h1>Welcome to your Dashboard, {user.displayName.split(" ")[0]}</h1>
      <p>Here are your todos</p>

      <ul>
        {
          todos.map(({id, text}) => (
            <li key={id}>
              <span 
              onClick={() => handleRemove(id)}>X</span>
              &nbsp;{text}
            </li>
          ))
        }
      </ul>

      <form onSubmit={handleSubmit}>
        <input 
        name="text" 
        value={text} 
        onChange={handleChange} />
        <button>Add New Todo</button>
      </form>
    </div>
  )
}

function Navigation({authenticated, location }) {
  return (
    <nav>
        <ul>
          {
              location.pathname !== '/'
              &&
              <li>
                <Link to="/">Home</Link>
              </li>
            }
            {
              location.pathname !== '/dashboard'
              &&
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            }
            <li>
              {
                authenticated 
                ?
                <span
                style={linkStyles} 
                onClick={logout}>Logout</span>
                :
                <span
                style={linkStyles} 
                onClick={login}>Login</span>
              }
            </li>
        </ul>
    </nav>
  )
}

const RouterNav = withRouter(Navigation);

class App extends Component {
  constructor(){
    super();
    this.state = this.getNewState();
  }

  getNewState = () => {
    return {
      authenticated: false,
      user: null,
      dbRef: null,
      text: "",
      todos: []
    };
  }
  
  handleChange = e => {
    this.setState({[e.target.name]: e.target.value })
  };
  
  handleSubmit = e => {
    const {dbRef, text} = this.state;
    e.preventDefault();
    create(dbRef, {
      text,
      completed: false
    })
    .then(() => this.setState({text: ""}));
  };

  handleRemove = todoId => {
    remove(this.state.dbRef, todoId);
  };

  handleAddTodoListener = () => {
    database.ref(this.state.dbRef)
    .on('value', snapshot => {
      const newStateArray = [];
      snapshot.forEach(childSnapshot => {
        newStateArray.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      this.setState({todos: newStateArray})
    });
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if(user) {
        this.setState({
          authenticated: true,
          user,
          dbRef: `users/${user.uid}/todos`
        }, this.handleAddTodoListener);
      } else {
        this.setState(this.getNewState());
      }
    })
  }

  render() {
    return (
      <Router>
        <RouterNav authenticated={this.state.authenticated}/>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" render={props => (
            <Login
            authenticated={this.state.authenticated} />
          )} />
          <PrivateRoute 
          path="/dashboard"
          authenticated={this.state.authenticated}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          handleRemove={this.handleRemove}
          user={this.state.user} 
          text={this.state.text} 
          todos={this.state.todos} 
          component={Dashboard} />
        </Switch>
      </Router>
    );
  }
}

export default App;
