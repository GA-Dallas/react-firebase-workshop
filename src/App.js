import React, { Component } from 'react';
import { withRouter, BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom';
import { login, logout, auth, database, create, remove } from './services/firebase';
import './App.css';


const linkStyle = {
  cursor: 'pointer',
  color: 'purple',
  textDecoration: 'underline'
}

// These are our components
function Home() {
  return(
    <div>
      <h2>Welcome to React Fire Todos</h2>
    </div>
  )
}

function Navigation({location, authenticated}){
  return (  
      <ul>
        {
          location.pathname !== "/"
          && 
          <li>
            <Link to="/">Home</Link>
          </li> 
        }
        {
          location.pathname !== "/dashboard"
          && 
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li> 
        }
        {
          authenticated 
          &&
          <li>
            <span style={linkStyle} 
            onClick={logout}>Logout</span>
          </li>
          }
    </ul>
  )
}

const RouterNav = withRouter(Navigation);

function Dashboard({
  todos, 
  user, 
  text, 
  handleChange, 
  handleSubmit, 
  handleRemove }) {
  return(
    <div>
      <h2>Welcome to your Dashboard, {user.displayName.split(" ")[0]}</h2>
      <img 
      style={{
        height: 150,
        borderRadius: '50%' 
      }} 
      src={user.photoURL} 
      alt={user.displayName}/>
      <ul>
        {
          todos.map(({id, text}) => (
            <li key={id}>
              <span 
              onClick={() => handleRemove(id)}
              >X</span>&nbsp;
            {text}</li>
          ))
        }
      </ul>
      <form onSubmit={handleSubmit}>
        <input 
        name="text" 
        value={text} 
        onChange={handleChange} 
        />
        <button>Add Todo Item</button>
      </form>
    </div>
  );
}

function Login({ authenticated }) {
  if (authenticated) return <Redirect to="/dashboard" />
  return(
    <div>
      <h2>You Must Be Logged In To View This Page</h2>
      <button onClick={login}>Login With Google</button>
    </div>
  );
}

// Here's our PrivateRoute

function PrivateRoute({authenticated, component: Component, ...rest}) {
  return (
    <Route {...rest} render={props => (
      authenticated 
      ? <Component {...rest} {...props} />
      : <Redirect to="/login" />
    )}/>
  );
}


class App extends Component {
  state = { 
    authenticated: false,
    todos: [],
    text: "",
    user: null,
    dbRef: null
  };

  handleChange = e => {
    this.setState({[e.target.name]: e.target.value});
  };

  handleSubmit = e => {
    const {dbRef, text} = this.state;
    e.preventDefault();
    create(dbRef, {
      text,
      completed: false
    }).then(() => this.setState({text: ""}))
  };

  handleRemove = todoId => {
    remove(this.state.dbRef, todoId);
  }

  handleAddTodoListener = () => {
    database.ref(this.state.dbRef)
    .on('value', snapshot => {
      const newState = [];
      snapshot.forEach(childSnapshot => {
        newState.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        })
      })
      this.setState({ todos: newState });
    })
  }
  
  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if(user) {
        this.setState({
          authenticated: true,
          dbRef: `users/${user.uid}/todos`,
          user: user,
         }, this.handleAddTodoListener);
      } else {
        this.setState({ 
        authenticated: false,
        dbRef: null,
        user: null,
        todos: []
      })
      }
    })
  }


  render() {
    return (
      <BrowserRouter>
        <RouterNav authenticated={this.state.authenticated}/>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" render={props => (
            <Login 
            {...props}
            authenticated={this.state.authenticated} />
          )}/>
          <PrivateRoute 
            path="/dashboard"
            authenticated={this.state.authenticated}
            todos={this.state.todos}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            handleRemove={this.handleRemove}
            text={this.state.text}
            user={this.state.user}
            component={Dashboard}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
