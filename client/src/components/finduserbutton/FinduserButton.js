import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './finduserbutton.css';

class FinduserButton extends Component {
  render() {
    return (
      <div className='finduser-btn'>
        <Link to='/findusers' className='btn btn-primary'>
          Find Users
        </Link>
      </div>
    );
  }
}

export default FinduserButton;
