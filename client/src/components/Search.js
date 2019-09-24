import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const API_KEY = process.env.REACT_APP_API_KEY;
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: [],
      search: ''
    };
  }

  handleChange = e => {
    const search = e.target.value;
    if (search === '') {
      this.setState(
        {
          info: [],
          search: ''
        },
        () => {
          this.props.change(this.state.info, this.state.search);
        }
      );
    } else {
      this.setState({ search: search }, async () => {
        await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${this.state.search}`
        )
          .then(response => response.json())
          .then(data =>
            this.setState({ info: data.results }, () => {
              this.props.change(this.state.info, this.state.search);
            })
          );
      });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const search_term = this.state.search;
    if (search_term === '') {
      this.setState({
        info: this.props.trending,
        search: ''
      });
    } else {
      fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${search_term}`
      )
        .then(response => response.json())
        .then(data => this.setState({ info: data.results, search: '' }));
    }
  };

  render() {
    return (
      <div className='search__container'>
        <form onSubmit={this.handleSubmit}>
          <div className='search_main'>
            <input
              className='search__input'
              type='text'
              placeholder='Search for a movie'
              maxLength='25'
              value={this.state.search}
              onChange={this.handleChange}
            />
            {this.props.login ? (
              <Link to='/findUsers' className='findusers' href='#'>
                Find Users
              </Link>
            ) : (
              ''
            )}
          </div>
          {/* <button onClick={this.handleSubmit}>search</button> */}
        </form>
      </div>
    );
  }
}

export default Search;
