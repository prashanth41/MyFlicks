import React from "react";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import "./Watchlist.css";

class Watchlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moviesList: []
    };
  }

  componentDidMount = async () => {
    axios.get("/users/", { withCredentials: true }).then((res) => {
      console.log(res.data.data);
      if (res.data.data === "LOGIN") {
        this.props.history.push("/login");
      }
    });
    await axios
      .get("/users/getWatchList", {
        withCredentials: true
      })
      .then((res) => this.setState({ moviesList: res.data.data }))
      .catch((err) => console.log("Error while fetching data", err));
  };

  render() {
    const watchList = this.state.moviesList.map((movie) => (
      <div className="card" key={movie.id} style={{ width: "18rem" }}>
        <div className="image-container">
          <Link to={`movie/${movie.id}`}>
            <img
              className="card-img-top movie-img"
              src={movie.image}
              alt={movie.title}
            />
          </Link>
        </div>

        <div className="card-body">
          <Link to={`movie/${movie.id}`} className="a_card_title">
            <h5 className="card-title">{movie.title}</h5>
          </Link>

          <p className="card-text">
            <span>Release Date: </span>
            {movie.release_date}
          </p>
        </div>
      </div>
    ));

    return (
      <div className="watchlist-main container">
        <div className="back-button">
          <button
            className="btn"
            onClick={() => {
              this.props.history.push("/");
            }}
          >
            <i className="fa fa-arrow-circle-left" />
          </button>
        </div>
        <div className="watchlist">{watchList}</div>
      </div>
    );
  }
}

export default withRouter(Watchlist);
