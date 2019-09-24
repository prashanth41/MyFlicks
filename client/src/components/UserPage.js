import React, { Component } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard';
import { withRouter } from 'react-router-dom';
import './userpage.css';

class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      user: {
        name: {
          first: '',
          last: ''
        },
        profilepic: '',
        watchlist: [],
        friendlist: [],
        wishlist: []
      },
      myWatchlist: [],
      myFriendlist: [],
      isFriend: false
    };
  }

  componentDidMount() {
    this.setState({
      id: this.props.match.params.id
    });

    axios.get(`/users/getUser/${this.props.match.params.id}`).then(res =>
      this.setState({
        user: res.data.data
      })
    );
    this.checkFriendlistToState();
    this.checkWatchlistToState();
  }

  checkFriendlistToState = async () => {
    await axios.get('/users/', { withCredentials: true }).then(res => {
      console.log(res.data.data);
      if (res.data.data === 'LOGIN') {
        this.props.history.push('/login');
      }
    });

    await axios
      .get('/users/getFriendList', {
        withCredentials: true
      })
      .then(res => {
        this.setState(
          {
            myFriendlist: res.data.data
          },
          () => {
            let myFriendlist = this.state.myFriendlist;
            if (
              myFriendlist.some(id => {
                return id.id === this.props.match.params.id;
              })
            ) {
              this.setState(
                {
                  isFriend: true
                },
                () => {
                  console.log(this.state);
                }
              );
            } else {
              this.setState({
                isFriend: false
              });
            }
          }
        );
      });
  };

  checkWatchlistToState = async () => {
    await axios
      .get('/users/getWatchList', {
        withCredentials: true
      })
      .then(res => {
        this.setState({
          myWatchlist: res.data.data
        });
      });
  };

  toggleWatchList = async (id, title, image, release_date, inList) => {
    let movie = {
      id: id.toString(),
      title: title,
      image: image,
      release_date: release_date.toString()
    };

    if (!inList) {
      await axios
        .post('/users/addToWatchList', movie, {
          withCredentials: true
        })
        .then(res => {
          console.log(res.data);
        });
    } else {
      await axios
        .post('/users/deleteWatchList', movie, {
          withCredentials: true
        })
        .then(res => {
          console.log(res.data);
        });
    }

    this.checkWatchlistToState();
  };

  addToFriendList = async () => {
    let friend = {
      id: this.props.match.params.id,
      name: this.state.user.name,
      profilepic: this.state.user.profilepic
    };

    await axios
      .post('/users/addToFriendList', friend, { withCredentials: true })
      .then(res => {
        console.log(res.data);
      });

    this.checkFriendlistToState();
  };

  deleteFromFriendList = async () => {
    let friend = {
      id: this.props.match.params.id,
      name: this.state.user.name,
      profilepic: this.state.user.profilepic
    };

    await axios
      .post('/users/deleteFromFriendList', friend, { withCredentials: true })
      .then(res => {
        console.log(res.data);
      });

    this.checkFriendlistToState();
  };

  render() {
    const {
      name,
      profilepic,
      watchlist,
      friendlist,
      wishlist
    } = this.state.user;

    const { isFriend } = this.state;

    const movieList =
      watchlist.length > 0
        ? watchlist.map(movie => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              from='userpage'
              image={movie.image}
              login={this.props.login}
              title={movie.title}
              release_date={movie.release_date}
              toggleWatchList={this.toggleWatchList}
              inList={this.state.myWatchlist.some(function(id) {
                return id.id === movie.id.toString();
              })}
            />
          ))
        : 'No movies in this list';

    return this.state.user.name.first.length > 0 ? (
      <div className='container userpage-main'>
        <div className='row profile'>
          <div className='col-md-3'>
            <div className='profile-sidebar'>
              <div className='profile-userpic'>
                <img src={`${profilepic}`} className='img-responsive' alt='' />
              </div>
              <div className='profile-usertitle'>
                <div className='profile-usertitle-name'>
                  {name.first} {name.last}
                </div>
                <div className='profile-usertitle-job'>Developer</div>
              </div>
              <div className='profile-userbuttons'>
                {!isFriend ? (
                  <button
                    type='button'
                    className='btn btn-success btn-sm'
                    onClick={() => {
                      this.addToFriendList();
                    }}
                  >
                    Follow
                  </button>
                ) : (
                  <button
                    type='button'
                    className='btn btn-sm lightRed'
                    onClick={() => {
                      this.deleteFromFriendList();
                    }}
                  >
                    Unfollow
                  </button>
                )}
                <button
                  type='button'
                  className='btn lightBlue btn-sm disable'
                  disabled
                >
                  Message
                </button>
              </div>
              {/* <div class='profile-usermenu'>
                <ul class='nav'>
                  <li class='active'>
                    <a href='#'>
                      <i class='glyphicon glyphicon-home' />
                      Overview{' '}
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <i class='glyphicon glyphicon-user' />
                      Account Settings{' '}
                    </a>
                  </li>
                  <li>
                    <a href='#' target='_blank'>
                      <i class='glyphicon glyphicon-ok' />
                      Tasks{' '}
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <i class='glyphicon glyphicon-flag' />
                      Help{' '}
                    </a>
                  </li>
                </ul>
              </div> */}
            </div>
          </div>
          <div className='col-md-9'>
            <div className='profile-content'>
              <h4>{`${name.first}'s Watchlist:`}</h4>
              <div className='profile-watchlist-content'>{movieList}</div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className='container'>Loading...</div>
    );
  }
}

export default UserPage;
