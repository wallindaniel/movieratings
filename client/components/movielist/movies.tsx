import React from 'react';
import { observer, inject, Observer } from 'mobx-react';
import { Query } from 'react-apollo';
import Dialog from '../dialog/ratings.tsx';
import autobind from 'autobind-decorator'
import { GET_MOVIES } from './queries';
import './styles.scss';

interface MovieListState {
    showDialog: boolean,
    movie: any
}

interface MovieListProps {
    store: any
}

@inject('store')
@observer
class MovieList extends React.Component<MovieListProps, MovieListState, {}> {
    constructor(props : MovieListProps) {
        super(props);

        this.state = {
            showDialog: false,
            movie: {}
        };
    }

    @autobind
    public closeRatingDialog(movieId: number, rating: number) {
        this.setState({
            showDialog: false
        }, () => {
            if (movieId) {
                this.props.store.addRating(movieId, rating);
            }
        })
    }

    @autobind
    public addRating(movieId: number, rating: number) {
        this.props.store.addRating(movieId, rating);
    }

    @autobind
    public showRatingDialog(movie: object) {
        this.setState({
            showDialog: true,
            movie
        });
    }

    @autobind
    public textTruncate(str: string, length: number, ending: string) {
        return (str.length > length)
            ? str.substring(0, length - ending.length) + ending : str;
    }

    @autobind
    public addMoviesToStore(movies: object[]) {
        const movieList: object[] = movies.map(movie =>
            Object.assign({}, movie, { ratings: [] })
        );
        this.props.store.addMovies(movieList);
    }

    @autobind
    public calculateAverage(ratings: string[]) {
        let rating: number = 0;
        let total: number = 0;

        if (ratings.length) {
            for (let i = 0; i < ratings.length; i++) {
                total += parseInt(ratings[i]);
            }
            rating = parseFloat((total / ratings.length).toFixed(1));
        }

        return rating;
    }

    public renderMovies() {
        const { store } = this.props;

        return store.movies.map((movie, i) => (
            <div key={movie.id} className="list-item-wrapper">
                <li className="list-item"
                    key={movie.id}>
                    <div id={movie.id}
                         onClick={event => this.showRatingDialog(movie)}
                         className="like-wrapper">
                        <span className="average">
                            {
                                movie.ratings.length
                                    ? this.calculateAverage(movie.ratings)
                                    : <i className="fas fa-heart" />
                            }
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

    public render() {
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