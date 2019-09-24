import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import './Navbar.css';
import axios from 'axios';
class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      firstname: '',
      lastname: ''
    };
  }

  onLogoutClick = () => {
    axios.get('/users/logout', { withCredentials: true }).then(res => {
      if (res.data.data === 'LOGIN') {
        this.setState({
          login: false
        });
      }
    });
    this.props.toggleLogin(false);
    this.props.history.push('/');
  };

  render() {
    return (
      <nav
        className='navbar navbar-main navbar-expand-lg'
        style={
          this.props.history.location.pathname === '/login' ||
          this.props.history.location.pathname === '/createAccount'
            ? { background: 'rgb(165, 45, 45)' }
            : {}
        }
      >
        <div className='nav-container container'>
          <div className='brand-div'>
            <Link
              to='/'
              className='navbar-brand brand mr-auto logo'
              href='#'
              style={
                this.props.history.location.pathname === '/login' ||
                this.props.history.location.pathname === '/createAccount'
                  ? { color: 'white' }
                  : {}
              }
            >
              <span className='w0'>M</span>
              <span className='w1'>y</span>
              <span className='w2'> </span>
              <span className='w3'>F</span>
              <span className='w4'>l</span>
              <span className='w5'>i</span>
              <span className='w6'>c</span>
              <span className='w7'>k</span>
              <span className='w8'>s</span>
            </Link>
          </div>
          <div
            className='collapse navbar-collapse dropdown-main'
            id='navbarSupportedContent'
          >
            {this.props.login || this.state.login ? (
              <ul className='navbar-nav'>
                <li className='nav-item dropdown'>
                  <Link
                    to='/'
                    className='nav-link dropdown-toggle'
                    href='#'
                    id='navbarDropdown'
                    role='button'
                    data-toggle='dropdown'
                    aria-haspopup='true'
                    aria-expanded='false'
                  >
                    {this.props.firstname} {this.props.lastname}
                  </Link>
                  <div
                    className='dropdown-menu'
                    aria-labelledby='navbarDropdown'
                  >
                    <Link to='/watchlist' className='dropdown-item' href='#'>
                      My Watchlist
                    </Link>
                    <Link to='/myfriends' className='dropdown-item' href='#'>
                      My Friends
                    </Link>
                    <div className='dropdown-divider' />
                    <Link to='/' className='dropdown-item disabled' href='#'>
                      Edit Profile
                    </Link>
                    <Link
                      to='/'
                      onClick={() => {
                        this.onLogoutClick();
                      }}
                      className='dropdown-item'
                      href='#'
                    >
                      Logout
                    </Link>
                  </div>
                </li>
              </ul>
            ) : (
              <div>
                <a
                  className='login'
                  href='/login'
                  onClick={this.onLoginClick}
                  style={
                    this.props.history.location.pathname === '/login' ||
                    this.props.history.location.pathname === '/createAccount'
                      ? { color: 'white', width: '10rem' }
                      : {}
                  }
                >
                  Login
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  }
}

export default withRouter(Navbar);
