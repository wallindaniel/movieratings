import gql from 'graphql-tag';

export const GET_MOVIE = gql`
    query movie($id: String!) {
        movie(id: $id) {
            id
            manifest
            name
        }
    }
`;

export const GET_MOVIES = gql`
    query movies {
        movies {
            id
            vote_count
            video
            vote_average
            title
            popularity
            poster_path
            original_language
            original_title
            genre_ids
            backdrop_path
            adult
            overview
            release_date
        }
    }
`;