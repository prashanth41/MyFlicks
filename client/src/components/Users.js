import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Users extends Component {
  render() {
    const {
      first_name,
      last_name,
      _id,
      profile_pic,
      is_friend,
      login
    } = this.props;
    return (
      <div className='card' style={{ width: '17rem' }}>
        <div className='image-container'>
          <Link to={`user/${_id}`}>
            <img
              className='card-img-top movie-img'
              src={profile_pic}
              alt={first_name}
            />
          </Link>
        </div>
        <div className='card-body'>
          <Link to={`user/${_id}`} className='a_card_title'>
            <h5 className='card-title'>
              {first_name} {last_name}
            </h5>
          </Link>
        </div>
      </div>
    );
  }
}

export default Users;
