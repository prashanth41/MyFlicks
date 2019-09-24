import React, { Component } from 'react';
import MovieCard from './MovieCard';
import axios from 'axios';

class MovieMain extends Component {
  toggleWatchList = async (id, title, image, release_date, inList, rating) => {
    let movie = {
      id: id.toString(),
      title: title,
      image: image,
      release_date: release_date.toString(),
      rating: rating
    };

    if (!inList) {
      await axios
        .post('/users/addToWatchList', movie, {
          withCredentials: true
        })
        .then(res => {
          // console.log(res.data);
        });
    } else {
      await axios
        .post('/users/deleteWatchList', movie, {
          withCredentials: true
        })
        .then(res => {
          // console.log(res.data);
        });
    }
    this.props.checkWatchListToState(movie);
  };

  render() {
    return (
      <div className='movies-list'>
        {this.props.info
          ? this.props.info.map(movie => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                login={this.props.login}
                src={movie.backdrop_path}
                title={movie.title}
                release_date={movie.release_date}
                toggleWatchList={this.toggleWatchList}
                inList={this.props.watchlist.some(function(id) {
                  return id.id === movie.id.toString();
                })}
              />
            ))
          : 'No Movie Found'}
      </div>
    );
  }
}

export default MovieMain;
