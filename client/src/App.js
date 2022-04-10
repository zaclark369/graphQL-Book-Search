import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ApolloProvider, createHttpLink, ApolloClient, InMemoryCache} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

const authLink = setContext((_, {headers, ...context})) => {
  const token = localStorage.getItem('id_tokent')
  return {
    headers: {
      ...headers,
      authorization: token?`Bearer ${token}` : ''
    }
    ...context,
  };
};

const httpLink = createHttpLink({
  uri: "/graphql",
});

const client = new ApolloClient({
  // build link with graphql extentions
  link: authLink.concat(httpLink),

  // need chache to be new or gets stuck in loop turns out
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
    <Router>
      <>
        <Navbar />
        <Switch>
          <Route exact path='/' component={SearchBooks} />
          <Route exact path='/saved' component={SavedBooks} />
          <Route render={() => <h1 className='display-2'>Wrong page, please try again!</h1>} />
        </Switch>
      </>
    </Router>
    </ApolloProvider>
  );
}

export default App;
