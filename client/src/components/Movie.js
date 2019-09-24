import React from 'react';
import { withRouter } from 'react-router-dom';
import './Movie.css';

const API_KEY = process.env.REACT_APP_API_KEY;
class Movie extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      id: '',
      release_date: '',
      genres: [],
      poster_path: '',
      overview: '',
      runtime: '',
      adult: false,
      budget: 0,
      box_office_collection: 0,
      status: '',
      cast: [
        { name: 'N/A' },
        { name: 'N/A' },
        { name: 'N/A' },
        { name: 'N/A' },
        { name: 'N/A' }
      ]
    };
  }

  componentDidMount = async () => {
    await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/movie/${this.props.match.params.id}?api_key=${API_KEY}&language=en-US`
      ),
      fetch(
        `https://api.themoviedb.org/3/movie/${this.props.match.params.id}/credits?api_key=${API_KEY}`
      )
    ])
      .then(([res1, res2]) => Promise.all([res1.json(), res2.json()]))
      .then(([data1, data2]) =>
        this.setState({
          adult: data1.adult,
          genres: data1.genres,
          id: data1.id,
          overview: data1.overview,
          poster_path: 'https://image.tmdb.org/t/p/w500' + data1.poster_path,
          title: data1.title,
          release_date: data1.release_date,
          runtime: data1.runtime,
          budget: data1.budget,
          box_office_collection: data1.revenue,
          status: data1.status,
          cast: data2.cast
        })
      );
  };

  movieBudget = budget => {
    if (budget === 0) {
      return 'N/A';
    } else {
      let budgetInMillions = 0;
      var result = '';

      budgetInMillions = Number.isInteger(budget / 10 ** 6)
        ? budget / 10 ** 6
        : (budget / 10 ** 6).toFixed(2);

      // console.log(budgetInMillions);

      budgetInMillions = budgetInMillions.toString();
      // console.log(budgetInMillions);
      result = budgetInMillions.toString() + ' million USD';
      // console.log(result);

      return result;
    }
  };

  boxOffice = collection => {
    if (collection === 0) {
      return 'N/A';
    } else {
      let collectionInMillions = 0;
      var resultBoxOffice = '';

      collectionInMillions = Number.isInteger(collection / 10 ** 6)
        ? collection / 10 ** 6
        : (collection / 10 ** 6).toFixed(2);

      resultBoxOffice = collectionInMillions.toString() + ' million USD';
      return resultBoxOffice;
    }
  };

  render() {
    let display_genres = '';
    for (var i = 0; i < this.state.genres.length; i++) {
      if (i === this.state.genres.length - 1) {
        display_genres += this.state.genres[i].name + '.';
      } else {
        display_genres += this.state.genres[i].name + ', ';
      }
    }

    let topCast = '';
    for (var j = 0; j < 5; j++) {
      if (j === 4) {
        topCast += this.state.cast[j].name + '.';
      } else {
        topCast += this.state.cast[j].name + ', ';
      }
    }

    // console.log(this.props.history.goBack);

    return (
      <div className='movie-container container'>
        <div className='back-button'>
          <button
            className='btn'
            onClick={() => {
              this.props.history.goBack();
            }}
          >
            <i className='fa fa-arrow-circle-left' />
          </button>
          <h2 className='title'>{this.state.title}</h2>
        </div>
        <div className='movie'>
          <div className='image-container'>
            <img src={this.state.poster_path} alt={this.state.title} />
          </div>

          <div className='overview-container'>
            <p>
              <span className='subtitle'>
                Release Date <br />
              </span>
              {this.state.release_date}
            </p>
            <p>
              <span className='subtitle'>
                Budget <br />
              </span>
              {this.movieBudget(this.state.budget)}
            </p>
            <p>
              <span className='subtitle'>
                Box Office <br />
              </span>
              {this.boxOffice(this.state.box_office_collection)}
            </p>
            <p>
              <span className='subtitle'>
                Runtime <br />
              </span>
              {this.state.runtime === 0 ? 'N/A' : this.state.runtime} min
            </p>
            <p>
              <span className='subtitle'>
                Status <br />
              </span>
              {this.state.status}
            </p>
            <div>
              <span className='subtitle'>
                Cast <br />
              </span>
              <ul>{topCast}</ul>
            </div>
            <div>
              <span className='subtitle'>
                Genres <br />{' '}
              </span>
              <ul>{display_genres}</ul>
            </div>
            <div className='text-justify'>
              <span className='subtitle'>
                Overview <br />
              </span>
              {this.state.overview}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Movie);
