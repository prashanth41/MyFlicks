import React, { Component } from 'react';
import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import axios from 'axios';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Main from './components/Main';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import Movie from './components/Movie';
import Watchlist from './components/watchlist/Watchlist';
import Friendlist from './components/friendlist/Friendlist';
import SearchUser from './components/SearchUser';
import UserPage from './components/UserPage';
import Footer from './components/layout/Footer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      firstname: '',
      lastname: '',
      login: false,
      watchlist: []
    };
  }

  componentWillMount = async () => {
    // console.log('DID MOUNT');
    await axios.get('/users/', { withCredentials: true }).then(res => {
      if (res.data.data === 'LOGGEDIN') {
        this.setState({
          login: true,
          firstname: res.data.user.name.first,
          lastname: res.data.user.name.last,
          watchlist: res.data.user.watchlist
        });
      } else if (res.data.data === 'LOGIN') {
        this.setState({
          login: false
        });
      }
    });
  };

  setUser = (user, login) => {
    // console.log(user);
    this.setState({ user: user, login: login }, () => {
      this.setState({
        firstname: this.state.user.name.first,
        lastname: this.state.user.name.last
      });
    });
  };

  toggleLogin = () => {
    this.setState({
      login: false,
      user: {}
    });
  };

  render() {
    return (
      <Router>
        <Navbar
          user={this.state.user}
          firstname={this.state.firstname}
          lastname={this.state.lastname}
          toggleLogin={this.toggleLogin}
          login={this.state.login}
        />
        <Route
          exact
          path='/'
          component={props => (
            <Main user={this.state.user} login={this.state.login} />
          )}
        />
        <Route
          exact
          path='/findusers'
          component={props => (
            <SearchUser user={this.state.user} login={this.state.login} />
          )}
        />
        <Route
          exact
          path='/login'
          component={props => <Login setUser={this.setUser} />}
        />
        <Route exact path='/createaccount' component={CreateAccount} />
        <Route exact path='/movie/:id' component={Movie} />
        <Route exact path='/watchlist' component={Watchlist} />
        <Route exact path='/myfriends' component={Friendlist} />
        <Route
          exact
          path='/user/:id'
          component={props => (
            <UserPage
              {...props}
              watchlist={this.state.watchlist}
              login={this.state.login}
            />
          )}
        />
        <Footer />
      </Router>
    );
  }
}

export default App;
