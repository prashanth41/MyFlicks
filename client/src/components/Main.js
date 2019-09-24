import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Search from './Search';
import MovieMain from './MovieMain';
import FinduserButton from './finduserbutton/FinduserButton';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY;
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      info: [],
      trending: [],
      login: false,
      firstname: '',
      lastname: '',
      user: {},
      watchlist: [],
      notFound: false,
      search: ''
    };
  }

  componentDidMount = async () => {
    await axios.get('/users/', { withCredentials: true }).then(res => {
      if (res.data.data === 'LOGGEDIN') {
        this.setState({
          login: true,
          user: res.data.user,
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
    await fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
    )
      .then(response => response.json())
      .then(data =>
        this.setState({
          info: data.results,
          trending: data.results,
          search: ''
        })
      );
  };

  handleChange = (info, search) => {
    console.log(info);
    if (info.length !== 0 && search.length !== 0) {
      this.setState({
        info: info,
        notFound: false
      });
    } else if (info.length === 0 && search.length !== 0) {
      this.setState({
        info: this.state.trending,
        notFound: true,
        search: search
      });
    } else {
      this.setState({
        info: this.state.trending,
        notFound: false
      });
    }
  };

  checkWatchListToState = async () => {
    await axios
      .get('/users/getWatchList', {
        withCredentials: true
      })
      .then(res => {
        this.setState({
          watchlist: res.data.data
        });
      });
  };

  render() {
    const { watchlist } = this.state;
    return (
      <div className='app'>
        <div className='search-bar-main container'>
          <div className='search-bar'>
            <Search login={this.props.login} change={this.handleChange} />
          </div>
        </div>
        <div className='movies-main'>
          {this.state.notFound ? (
            <div className='container'>
              <h4>No movie found</h4>
            </div>
          ) : (
            <MovieMain
              checkWatchListToState={this.checkWatchListToState}
              login={this.props.login}
              watchlist={watchlist}
              info={this.state.info}
            />
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(Main);
