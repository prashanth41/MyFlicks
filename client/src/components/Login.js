import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './login.css';
import axios from 'axios';

class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      notfound: false,
      incorrectPass: false,
      sessionID: '',
      user: {}
    };
  }

  componentDidMount() {
    document.body.classList.toggle('redClass', true);
    axios.get('/users/', { withCredentials: true }).then(res => {
      console.log(res.data.data);
      if (res.data.data === 'LOGGEDIN') {
        this.props.history.goBack();
      } else if (res.data.data === 'LOGIN') {
        this.props.history.push('/login');
      }
    });
  }

  componentWillUnmount() {
    document.body.classList.toggle('redClass', false);
  }

  onChangeEmail = e => {
    this.setState({
      email: e.target.value,
      notfound: false,
      incorrectPass: false,
      user: []
    });
  };

  onChangePassword = e => {
    this.setState({
      password: e.target.value,
      incorrectPass: false
    });
  };

  onSubmit = e => {
    e.preventDefault();

    const user = {
      email: this.state.email.toLowerCase(),
      password: this.state.password
    };

    axios
      .post('/users/login', user, {
        withCredentials: true
      })
      .then(res => {
        if (res.data.data === 'NOTFOUND') {
          this.setState({
            notfound: !this.state.notfound
          });
        } else if (res.data.data === 'INVALID') {
          this.setState({
            incorrectPass: true
          });
        } else if (res.data.data === 'PASS') {
          this.setState({ user: res.data.user, incorrectPass: false }, () => {
            this.props.setUser(this.state.user, true);
            console.log(this.state.user);
          });
          this.props.history.goBack();
        }
      });
  };

  render() {
    return (
      <div className='login-main'>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-9 col-md-7 col-lg-5 mx-auto'>
              <div className='card card-signin my-5'>
                <div className='card-body'>
                  <h5 className='card-title text-center'>Sign In</h5>
                  <form className='form-signin' onSubmit={this.onSubmit}>
                    <div className='form-label-group'>
                      <input
                        type='email'
                        id='inputEmail'
                        onChange={this.onChangeEmail}
                        className={`form-control ${
                          this.state.notfound ? 'redBorder' : ''
                        }`}
                        placeholder='Email address'
                        required
                        autoFocus
                      />
                      <label htmlFor='inputEmail'>Email address</label>
                      {this.state.notfound ? (
                        <small className='notFoundError'>
                          Email id not found
                        </small>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className='form-label-group'>
                      <input
                        type='password'
                        id='inputPassword'
                        onChange={this.onChangePassword}
                        className='form-control'
                        placeholder='Password'
                        required
                      />
                      <label htmlFor='inputPassword'>Password</label>

                      {this.state.incorrectPass ? (
                        <small className='incorrectPass'>
                          Email and Password do not match
                        </small>
                      ) : (
                        ''
                      )}
                    </div>
                    <button
                      className='btn btn-lg btn-primary btn-block text-uppercase'
                      type='submit'
                    >
                      Sign in
                    </button>
                  </form>

                  <div className='createAccountLink'>
                    <Link to='/createAccount'>Create Account?</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(LogIn);
