import { observable, action, computed, autorun } from 'mobx';

class MovieStore {
    @observable movieList = [];

    @action
    addMovies = movies => {
        this.movieList.replace(movies);
    };

    @action
    addRating = (movieId, rating) => {
        const index = this.movieList.findIndex(q => q.id === movieId);
        this.movieList[index].ratings.push(rating);
    };

    @computed
    get movies() {
        return this.movieList;
    }
}

const Store = window.store = new MovieStore();
export default Store;
