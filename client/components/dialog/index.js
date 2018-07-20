import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import autobind from 'autobind-decorator'
import styles from './styles.scss';

@inject('store')
@observer
class Dialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rating: 0,
            validation: ''
        };

        this.ratingComments = {
            "1": "Ouch, that was painful.",
            "2": "I had nothing else to do.",
            "3": "Like skimmed milk.",
            "4": "Oh my, my, this was nice.",
            "5": "Exceptional, a work of art."
        };
    }

    @autobind
    submitRating() {
        const { movie } = this.props;
        if (this.state.rating !== 0) {
            this.props.close(movie.id, this.state.rating);
            this.setState({ rating: 0, validation: '' });
        } else {
            this.setState({ validation: 'Please select rating' })
        }
    }

    @autobind
    closeDialog() {
        this.props.close();
        this.setState({ rating: 0 });
    }

    @autobind
    handleStars(event) {
        this.setState({
            rating: event.currentTarget.id,
            validation: ''
        });
    }

    renderRatingComment() {
        if (this.state.rating > 0) {
            return(
                <span className="rating-comment">
                    {this.ratingComments[this.state.rating]}
                </span>
            );
        }
        return null;
    }

    renderStars() {
        let stars = [];

        for (let i = 1; i < 6; i++) {
            let ratingClass = 'star';

            if (i <= this.state.rating) {
                ratingClass = 'star filled'
            }

            stars.push(
                <span key={i} id={i}
                  onClick={this.handleStars}
                  className={ratingClass}>
                    ☆
                </span>
            );
        }

        return (
            <div className="rating">
                <div className="stars">
                    {stars}
                </div>
            </div>
        );

    }

    render() {
        const { show, movie, average } = this.props;

        return (
            show &&
            <div className="overlay">
                <div className="rating-dialog">
                    <i onClick={this.closeDialog} className="close-icon fas fa-times" />
                    <h1 className="heading">What did you think about</h1>
                    <span className="sub-heading">{movie.title}</span>
                    <span className="number-of-votes">{`Number of votes: (${movie.ratings.length})`}</span>
                    <span className="average-votes">{`Average vote: (${average(movie)})`}</span>
                    {this.renderStars()}
                    {this.renderRatingComment()}
                    <button
                        onClick={this.submitRating}
                        className="rating-button">
                        Rate movie
                    </button>
                    <span className="validation">{this.state.validation}</span>
                </div>
            </div>
        );
    }
}

export default Dialog;