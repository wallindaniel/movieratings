import React from 'react';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';
import { GET_MOVIES } from './queries';
import styles from './styles.scss';

const Movies = props => (
    <Query query={ GET_MOVIES }>
        {({ loading, data: { movies } }) => {
            if (loading) return "";

            return (
                <div className="movie-library">
                    <h1 className="heading">Movie Library</h1>
                    <ul className="movie-list">
                        {movies.map(movie => (
                            <div key={movie.id} className="list-item-wrapper">
                                <li id={movie.id}
                                    className="list-item"
                                    key={movie.id}>
                                    <img className="poster"
                                         alt="movie-thumbnail"
                                         src={`http://image.tmdb.org/t/p/w185${movie.poster_path}`}/>
                                </li>
                                <span className="title">{movie.title}</span>
                                <div className="rating">
                                    <div className="stars">
                                        <span className="star filled">☆</span>
                                        <span className="star filled">☆</span>
                                        <span className="star filled">☆</span>
                                        <span className="star filled">☆</span>
                                        <span className="star">☆</span>
                                        <span className="votes">(24)</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </ul>
                </div>
            )
        }}
    </Query>
);

export default connect()(Movies);