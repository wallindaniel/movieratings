import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { observer, inject, Observer } from 'mobx-react';
import Dialog from '../dialog';
import autobind from 'autobind-decorator'
import { GET_MOVIES } from './queries';
import styles from './styles.scss';

@inject('store')
@observer
class MovieList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showDialog: false,
            movie: null
        };
    }

    @autobind
    closeRatingDialog(movieId, rating) {
        this.setState({
            showDialog: false
        }, () => {
            if (movieId) {
                this.props.store.addRating(movieId, rating);
            }
        })
    }

    @autobind
    addRating(movieId, rating) {
        this.props.store.addRating(movieId, rating);
    }

    @autobind
    showRatingDialog(movie) {
        this.setState({
            showDialog: true,
            movie
        });
    }

    @autobind
    textTruncate(str, length, ending) {
        return (str.length > length)
            ? str.substring(0, length - ending.length) + ending : str;
    }

    @autobind
    addMoviesToStore(movies) {
        const movieList = movies.map(movie =>
            Object.assign({}, movie, { ratings: [] })
        );
        this.props.store.addMovies(movieList);
    }

    @autobind
    calculateAverage(movie) {
        let rating = 0;
        let total = 0;

        if (movie.ratings.length) {
            for (let i = 0; i < movie.ratings.length; i++) {
                total += parseInt(movie.ratings[i]);
            }
            rating = (total / movie.ratings.length).toFixed(1)
        }

        return rating;
    }

    renderMovies() {
        const { store } = this.props;

        return store.movies.map((movie, i) => (
            <div key={movie.id} className="list-item-wrapper">
                <li className="list-item"
                    key={movie.id}>
                    <div id={movie.id}
                         onClick={event => this.showRatingDialog(movie)}
                         className="like-wrapper">
                        <span className="average">
                            {this.calculateAverage(movie)}
                        </span>
                    </div>
                    <img className="poster"
                         alt="movie-thumbnail"
                         src={`http://image.tmdb.org/t/p/w185${movie.poster_path}`}/>
                </li>
                <span className="title">{this.textTruncate(movie.title, 20, '...')}</span>
            </div>
        ))
    }

    render() {
        return (
            <Query query={ GET_MOVIES }>
                {({loading, data: { movies }}) => {
                    if (loading) return "";

                    if (!this.props.store.movies.length) {
                        this.addMoviesToStore(movies);
                    }

                    return (
                        <Observer>
                            {() => (
                                <div className="movie-library">
                                    <Dialog
                                        average={this.calculateAverage}
                                        addRating={this.addRating}
                                        close={this.closeRatingDialog}
                                        movie={this.state.movie}
                                        show={this.state.showDialog} />
                                    <h1 className="heading">Movie Library</h1>
                                    <ul className="movie-list">
                                        {this.renderMovies()}
                                    </ul>
                                </div>
                            )}
                        </Observer>
                    )
                }}
            </Query>
        );
    }
}

export default MovieList;