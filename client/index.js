import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import { HttpLink } from 'apollo-link-http';
import { Router, Route, Switch } from 'react-router';
import { createBrowserHistory } from 'history';
import { Provider } from 'mobx-react';
import store from './stores/moviestore';
import MovieList from './components/movielist/movies.tsx';
import styles from './styles.scss';

const history = createBrowserHistory();
const client = new ApolloClient({
    link: new HttpLink({ uri: '/graphql' })
});

ReactDOM.render(
    <ApolloProvider client={client} store={store}>
        <Provider store={store}>
            <Router history={history}>
                <Switch>
                    <Route exact path="/" component={MovieList} />
                </Switch>
            </Router>
        </Provider>
    </ApolloProvider>,
    document.getElementById('app')
);