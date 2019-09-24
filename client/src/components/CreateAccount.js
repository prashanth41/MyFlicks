import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// TODO: Add re-enter password field
// TODO: Hash Password

class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profilepic: '',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      phone: 0,
      alreadyPresent: false
    };
  }

  onChangeFirstName = e => {
    this.setState({
      firstname: e.target.value
    });
  };

  onChangeLastName = e => {
    this.setState({
      lastname: e.target.value
    });
  };

  onChangeEmail = e => {
    this.setState({
      email: e.target.value,
      alreadyPresent: false
    });
  };

  onChangePassword = e => {
    this.setState({
      password: e.target.value
    });
  };

  onChangePhone = e => {
    this.setState({
      phone: e.target.value
    });
  };

  componentDidMount() {
    document.body.classList.toggle('redClass', true);
  }

  componentWillUnmount() {
    document.body.classList.toggle('redClass', false);
  }

  onSubmit = e => {
    e.preventDefault();
    console.log('User Account Created', this.state.firstname);
    const newUser = {
      profilepic:
        'https://robohash.org/' + this.state.firstname + '?size=200x200',
      name: {
        first: this.state.firstname,
        last: this.state.lastname
      },
      email: this.state.email.toLowerCase(),
      password: this.state.password,
      phone: this.state.phone
    };
    axios.post('/users/createuser', newUser).then(res => {
      if (res.data.data !== 'User Already Present') {
        console.log(res.data);
        this.setState({
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          phone: 0,
          alreadyPresent: false
        });

        this.props.history.push('/login');
      } else {
        this.setState({
          alreadyPresent: true
        });
      }
    });
  };

  render() {
    return (
      <div className='createaccount-main'>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-9 col-md-7 col-lg-5 mx-auto'>
              <div className='card card-signin my-5'>
                <div className='card-body'>
                  <h5 className='card-title text-center'>Sign In</h5>
                  <form className='form-signin' onSubmit={this.onSubmit}>
                    <div className='form-label-group'>
                      <input
                        type='name'
                        id='inputFirst'
                        onChange={this.onChangeFirstName}
                        className='form-control'
                        placeholder='First Name'
                        required
                      />
                      <label htmlFor='inputFirst'>First Name</label>
                    </div>

                    <div className='form-label-group'>
                      <input
                        type='name'
                        id='inputLast'
                        onChange={this.onChangeLastName}
                        className='form-control'
                        placeholder='Last Name'
                        required
                      />
                      <label htmlFor='inputLast'>Last Name</label>
                    </div>

                    <div className='form-label-group'>
                      <input
                        type='email'
                        id='inputEmail'
                        onChange={this.onChangeEmail}
                        className={`form-control ${
                          this.state.alreadyPresent ? 'redBorder' : ''
                        }`}
                        placeholder='Email'
                        required
                      />
                      <label htmlFor='inputEmail'>Email address</label>
                      {this.state.alreadyPresent ? (
                        <small className='notFoundError'>
                          Email already in use
                        </small>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className='form-label-group'>
                      <input
                        type='password'
                        id='inputPass'
                        onChange={this.onChangePassword}
                        className='form-control'
                        placeholder='Password'
                        required
                      />
                      <label htmlFor='inputPass'>Password</label>
                    </div>

                    <div className='form-label-group'>
                      <input
                        type='phone'
                        id='inputPhone'
                        onChange={this.onChangePhone}
                        className='form-control'
                        placeholder='Phone'
                        required
                      />
                      <label htmlFor='inputPhone'>Phone</label>
                    </div>
                    <button
                      className='btn btn-lg btn-primary btn-block text-uppercase'
                      type='submit'
                    >
                      Create Account
                    </button>
                  </form>

                  <div className='createAccountLink'>
                    <Link to='/login'>Already Have an Account?</Link>
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

export default CreateAccount;
