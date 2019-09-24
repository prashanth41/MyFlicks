import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Rating from 'react-rating';
import axios from 'axios';

class Movie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ratingValue: ' ',
      ratingValue2: ' ',
      initialRating: 0
    };
  }

  componentDidMount() {
    if (this.props.inList) {
      console.log('Check');
      const movie = {
        id: this.props.id
      };
      axios
        .post('/users/getRating', movie, { withCredentials: true })
        .then(res => {
          this.setState({
            initialRating: res.data.data
          });
          // console.log(res.data);
        });
    }
  }

  onHoverRating = (value, i = 1) => {
    if (i === 2) {
      if (value === 1) {
        this.setState({
          ratingValue2: 'Horrible'
        });
      } else if (value === 2) {
        this.setState({
          ratingValue2: 'Poor'
        });
      } else if (value === 3) {
        this.setState({
          ratingValue2: 'Average'
        });
      } else if (value === 4) {
        this.setState({
          ratingValue2: 'Liked it'
        });
      } else if (value === 5) {
        this.setState({
          ratingValue2: 'Loved it'
        });
      } else {
        this.setState({
          ratingValue2: ' '
        });
      }
    } else {
      if (value === 1) {
        this.setState({
          ratingValue: 'Horrible'
        });
      } else if (value === 2) {
        this.setState({
          ratingValue: 'Poor'
        });
      } else if (value === 3) {
        this.setState({
          ratingValue: 'Average'
        });
      } else if (value === 4) {
        this.setState({
          ratingValue: 'Liked it'
        });
      } else if (value === 5) {
        this.setState({
          ratingValue: 'Loved it'
        });
      } else {
        this.setState({
          ratingValue: ' '
        });
      }
    }
  };

  updateRating = (id, value) => {
    // console.log(id, value);
    const movie = {
      id: id.toString(),
      rating: value
    };
    axios.put('/users/addRating', movie, { withCredentials: true });
  };

  render() {
    const {
      id,
      src,
      title,
      release_date,
      login,
      inList,
      from,
      image
    } = this.props;
    const url = 'https://image.tmdb.org/t/p/w300';
    let img_src = '';
    if (from === 'userpage') {
      img_src = image;
    } else if (src === null) {
      img_src = 'https://picsum.photos/id/1025/300/200';
    } else {
      img_src = url + src;
    }
    return (
      <div
        className='card movie-card'
        style={from === 'userpage' ? { width: '14rem' } : { width: '21rem' }}
      >
        <div className='image-container'>
          <Link to={`/movie/${id}`} className='link'>
            <img
              className='card-img-top movie-img'
              src={img_src}
              alt={title}
              title={title}
            />
          </Link>
          {login && inList ? (
            <div className='user-rating-main'>
              <div className='user-rating'>
                <Rating
                  emptySymbol='fa fa-star-o fa-2x'
                  onHover={rate => this.onHoverRating(rate, 2)}
                  fullSymbol='fa fa-star fa-2x'
                  initialRating={this.state.initialRating}
                  onClick={value =>
                    this.setState(
                      {
                        initialRating: value
                      },
                      () => {
                        this.updateRating(id, value);
                      }
                    )
                  }
                />
              </div>
              <span class='label label-default' id='label-onrate'>
                {this.state.ratingValue2}
              </span>
            </div>
          ) : (
            ''
          )}
          <div className='text hover'>
            <span className='movie-card-title'>{title}</span>
          </div>
          {login ? (
            <button
              className='watchlist_icon'
              onClick={() => {
                this.setState({
                  initialRating: 0
                });
                this.props.toggleWatchList(
                  id,
                  title,
                  img_src,
                  release_date,
                  inList,
                  this.state.initialRating
                );
              }}
              data-toggle='tooltip'
              data-placement='top'
              title={`${inList ? 'Remove from' : 'Add to'} your watchlist`}
            >
              {inList ? (
                <i className='fa fa-check fa-2x' alt='TEST' />
              ) : (
                <button
                  className='addList-btn hover1'
                  data-toggle='modal'
                  data-target={`#rateModal${id}`}
                >
                  <i className='fa fa-plus fa-2x' />
                </button>
              )}
            </button>
          ) : (
            ''
          )}
        </div>
        <div
          className='modal fade'
          id={`rateModal${id}`}
          tabIndex='-1'
          role='dialog'
          aria-labelledby={`rateModal${id}`}
          aria-hidden='true'
        >
          <div className='modal-dialog modal-dialog-centered' role='document'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title' id='exampleModalLongTitle'>
                  How was it?
                </h5>
                <button
                  type='button'
                  className='close'
                  data-dismiss='modal'
                  aria-label='Close'
                >
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <div className='rate-main'>
                  <div className='rate'>
                    {/* TODO: ADD RESET RATING */}
                    <div className='rating-title'>
                      <span className='rating-title-span'>
                        {this.state.ratingValue}
                      </span>
                    </div>
                    <Rating
                      emptySymbol='fa fa-star-o fa-2x'
                      fullSymbol='fa fa-star fa-2x'
                      initialRating={this.state.initialRating}
                      onHover={value => this.onHoverRating(value)}
                      onClick={value =>
                        this.setState(
                          {
                            initialRating: value
                          },
                          () => {
                            this.updateRating(id, value);
                          }
                        )
                      }
                    />
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

export default Movie;
