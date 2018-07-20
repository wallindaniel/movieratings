var express = require('express');
var graphqlHTTP = require('express-graphql');
var request = require('request');
var { buildSchema } = require('graphql');

function graphqlMiddleware() {
    var app = express();

    var schema = buildSchema(`
    type Movie {
      id: ID!
      vote_count: Int
      video: Boolean
      vote_average: Float
      title: String
      popularity: Float
      poster_path: String
      original_language: String
      original_title: String
      genre_ids: [Int]
      backdrop_path: String
      adult: Boolean
      overview: String
      release_date: String
    }

    type Query {
      movie(id: ID): Movie
      movies: [Movie]
    }
  `);

  function makeRequest() {
      return new Promise((resolve, reject) => {
          return request.get({ url: "https://api.themoviedb.org/3/discover/movie?api_key=549ba974993b237cd81549bbfdaf2a55"}, (error, response, body) => {
              if (!error && response.statusCode === 200) {
                  const obj = JSON.parse(body);
                  resolve(obj.results);
              } else {
                reject('Error');
              }
          });
      });
  }

  var rootValue = {
      movies() {
          return  makeRequest().then((data) => {
            return data;
          })
      },
  };

  app.use(graphqlHTTP({
      schema,
      rootValue,
      graphiql: true,
  }));

    return app;
}

module.exports = exports = graphqlMiddleware;