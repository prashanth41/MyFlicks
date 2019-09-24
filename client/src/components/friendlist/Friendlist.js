import React, { Component } from 'react';
import Users from '../Users';
import axios from 'axios';
import './friendlist.css';

class Friendlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friendlist: []
    };
  }

  async componentDidMount() {
    await axios.get('/users/', { withCredentials: true }).then(res => {
      console.log(res.data.data);
      if (res.data.data === 'LOGIN') {
        this.props.history.push('/login');
      }
    });

    await axios
      .get('/users/getFriendList', { withCredentials: true })
      .then(res => {
        this.setState({
          friendlist: res.data.data
        });
      });
  }

  render() {
    const { friendlist } = this.state;
    console.log(friendlist);

    let friends = '';
    if (friendlist.length > 0) {
      friends = this.state.friendlist.map((friend, i) => (
        <Users
          key={i}
          login={this.props.login}
          first_name={friend.name.first}
          last_name={friend.name.last}
          profile_pic={friend.profilepic}
          _id={friend.id}
        />
      ));
    } else {
      friends = "You don't follow anyone yet";
    }

    return (
      <div className='container'>
        <h4 className='friend-title'>My Friends: </h4>
        <div className='friends-main'>{friends}</div>
      </div>
    );
  }
}

export default Friendlist;
