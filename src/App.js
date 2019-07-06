import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom';
import { login, logout, auth } from './services/firebase';
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

function Dashboard() {
  return(
    <div>
      <h2>You're on the Dashboard</h2>
    </div>
  );
}

function Login({handleLogin, authenticated }) {
  if (authenticated) return <Redirect to="/dashboard" />
  return(
    <div>
      <h2>You Must Be Logged In To View This Page</h2>
      <button onClick={handleLogin}>Login With Google</button>
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
  state = { authenticated: false };
  
  handleLogin = () => login();
  
  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if(user) {
        this.setState({authenticated: true });
      } else {
        this.setState({ authenticated: false });
      }
    })
  }
  render() {
    return (
      <BrowserRouter>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
            {
              this.state.authenticated 
              &&
              <li>
                <span style={linkStyle} 
                onClick={logout}>Logout</span>
              </li>
            }
        </ul>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" render={props => (
            <Login 
            {...props}
            authenticated={this.state.authenticated} 
            handleLogin={this.handleLogin}/>
          )}/>
          <PrivateRoute 
          path="/dashboard"
          authenticated={this.state.authenticated}
          component={Dashboard}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
