import React, { Component } from 'react';
import {auth, login, logout, database, create, remove } from './services/firebase';
import { BrowserRouter, 
          Route, 
          Redirect, 
          Switch,
          Link } from 'react-router-dom'


const PrivateRoute = ({authenticated, component: Component, ...rest}) => {
  return(
    <Route {...rest} render={props => 
      authenticated 
      ? <Component {...props} {...rest}/>
      : <Redirect to="/login" />
    }/>
  );
}         


const Landing = () => (
  <h1>You're on the Landing Page</h1>
)

const Login = ({authenticated}) => {
    if(authenticated) return <Redirect to="/dashboard" />
    return(
      <>
        <h3>Please Login</h3>
        <button onClick={() => login()}>Login</button>
      </>
    )
}

class TodoList extends Component {
    state = {
      text: ""
    }

    handleChange = e => {
      this.setState({[e.target.name]: e.target.value });
    };

    handleSubmit = e => {
      e.preventDefault();
      create(this.props.dbRef, {
        text: this.state.text,
        completed: false
      })
      .then(() => {
        this.setState({text: ""})
      })
    };

    render() {
      const {todos} = this.props
      return (
        <>
          <h2>Todo List</h2>
          <ul>
            { todos.length !== 0 
              ? todos.map(({id, text}) => (
              <li key={id}>
                <span 
                onClick={() => remove(this.props.dbRef, id)}>X</span>
                &nbsp;{text}
              </li>
              ))
              :
              <h3>You Have No Todos Yet</h3>
            }
          </ul>
          <form onSubmit={this.handleSubmit}>
            <input 
            name="text" 
            value={this.state.text} 
            onChange={this.handleChange}/>
            <button>Add Todo</button>
          </form>
        </>
      );
    }
}


const DashBoard = ({todos, dbRef, user}) => {
    return(
      <>
        <h3>You're on the Dashboard, {user.displayName}</h3>
        <img 
        style={{height: 150, borderRadius: '50%'}} 
        src={user.photoURL} 
        alt={`${user.displayName}`}
        />
        <TodoList 
        todos={todos}
        dbRef={dbRef}
        />
        <button onClick={() => logout()}>Logout</button>
      </>
  );
}



export default class App extends Component {
  state = {
    authenticated: false,
    user: null,
    dbRef: null,
    todos: [],
  }

  handleLogin = () => {
    this.setState({authenticated: true})
  }

  handleLogout = () => {
    this.setState({authenticated: false})
  }

  updateTodos = todosArr => this.setState({todos: todosArr})

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if(user) {
        this.setState({
          authenticated: true, 
          user: user,
          dbRef: `users/${user.uid}/todos`
          }, () => {
          database.ref(this.state.dbRef)
          .on('value', snapshot => {
            const newState = []
            snapshot.forEach(child => {
              newState.push({
                id: child.key,
                ...child.val()
              })
            })
            this.updateTodos(newState)
          })    
        })
      } else {
        this.setState({
          authenticated: false, 
          user: null,
          dbRef: null,
          todos: [] 
        })
      }
    })
  }
  render() {
    return(
      <BrowserRouter>
        <ul>
          <li>
            <Link to="/">Landing</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/dashboard">DashBoard</Link>
          </li>
        </ul>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route path="/login" render={props => 
          <Login {...props}
          authenticated={this.state.authenticated} 
          handleLogin={this.handleLogin}/>
          }/>
          <PrivateRoute path="/dashboard" 
          authenticated={this.state.authenticated}
          handleLogout={this.handleLogout}
          todos={this.state.todos}
          dbRef={this.state.dbRef}
          user={this.state.user}
          component={DashBoard} />
        </Switch>
      </BrowserRouter>
    );
  }
}