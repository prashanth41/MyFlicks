import React, { Component } from 'react';
import './Footer.css';

class Footer extends Component {
  render() {
    return (
      <footer className='footer-main page-footer font-small blue'>
        <div className='footer-copyright text-center py-3'>
          <a href='https://github.com/nishitmehta1/myFlicks'>
            <i className='fa fa-github' /> GitHub
          </a>
        </div>
      </footer>
    );
  }
}

export default Footer;
