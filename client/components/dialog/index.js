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
            rating: 0
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
        this.props.close(movie.id, this.state.rating);
        this.setState({ rating: 0 });
    }

    @autobind
    handleStars(event) {
        this.setState({
            rating: event.currentTarget.id
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

        return stars;
    }

    render() {
        const { show, movie } = this.props;

        return (
            show &&
            <div className="overlay">
                <div className="rating-dialog">
                    <h1 className="heading">What did you think about</h1>
                    <span>{movie.title}</span>
                    <div className="rating">
                        <div className="stars">
                            {this.renderStars()}
                        </div>
                    </div>
                    {this.renderRatingComment()}
                    <button
                        onClick={this.submitRating}
                        className="rating-button">
                        Rate movie
                    </button>
                </div>
            </div>
        );
    }
}

export default Dialog;