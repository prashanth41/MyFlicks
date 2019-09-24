import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Users from './Users';
import axios from 'axios';

class SearchUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: [],
      search: '',
      users: []
    };
  }

  componentDidMount() {
    axios.get('/users/', { withCredentials: true }).then(res => {
      console.log(res.data.data);
      if (res.data.data === 'LOGIN') {
        this.props.history.push('/login');
      }
    });

    axios
      .get('/users/getUserList', {
        withCredentials: true
      })
      .then(res => {
        this.setState({
          users: res.data.data
        });
      });
  }

  // handleChange = e => {
  //   const search = e.target.value;
  //   if (search === '') {
  //     this.setState(
  //       {
  //         info: [],
  //         search: ''
  //       },
  //       () => {
  //         this.props.change(this.state.info, this.state.search);
  //       }
  //     );
  //   } else {
  //     this.setState({ search: search }, async () => {
  //       const user = {
  //         email: this.state.email.toLowerCase(),
  //         password: this.state.password
  //       };

  //       axios
  //         .post('http://localhost:4000/users/login', user, {
  //           withCredentials: true
  //         })
  //         .then(res => {
  //         });
  //     });
  //   }
  // };

  // handleSubmit = e => {
  //   e.preventDefault();
  //   const search_term = this.state.search;
  //   if (search_term === '') {
  //     this.setState({
  //       info: this.props.trending,
  //       search: ''
  //     });
  //   } else {
  //   }
  // };

  render() {
    let users = '';
    if (this.state.users) {
      users = this.state.users.map((user, i) => (
        <Users
          key={i}
          login={this.props.login}
          first_name={user.name.first}
          last_name={user.name.last}
          profile_pic={user.profilepic}
          _id={user._id}
        />
      ));
    } else {
      users = 'No user found';
    }
    return (
      <div className='app'>
        <div className='search-bar'>
          <div className='search__container container'>
            {/* <form onSubmit={this.handleSubmit}>
              <input
                className='search__input'
                type='text'
                placeholder='Search for a user'
                value={this.state.search}
                onChange={this.handleChange}
              />
              <button onClick={this.handleSubmit}>search</button>
            </form> */}
          </div>
        </div>
        <div className='users-main'>{users}</div>
      </div>
    );
  }
}

export default withRouter(SearchUser);
