import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import React from 'react';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

import ApolloClient from 'apollo-client';
import { meteorClientConfig } from 'meteor/apollo';
import { ApolloProvider } from 'react-apollo';
import logger from 'redux-logger';
import { persistStore, getStoredState } from 'redux-persist';

import App from '/imports/ui/App';

const client = new ApolloClient(meteorClientConfig());

const startup = state => {
  const store = createStore(
    combineReducers({
      apollo: client.reducer(),
    }),
    state, // initial state
    compose(
      applyMiddleware(client.middleware()),
      applyMiddleware(logger),
      // If you are using the devToolsExtension, you can add it here also
      (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
    )
  );

  Meteor.startup(() => {
    render(
      <ApolloProvider store={store} client={client}>
        <App />
      </ApolloProvider>,
      document.getElementById('app')
    );
  });

  return store;
};

if (Meteor.isDesktop) {
  const customStorage = {
    getItem: function(key, cb) {
      cb(null, Meteor._localStorage.getItem(key));
    },
    setItem: function(key, value, cb) {
      Meteor._localStorage.setItem(key, value);
    },
    removeItem: function(key, cb) {
      Meteor._localStorage.removeItem(key);
    },
    getAllKeys: function(cb) {
      cb(null, Object.keys(Meteor._localStorage.storage));
    },
  };

  getStoredState(
    {
      storage: customStorage,
    },
    (err, restoredState) => {
      const store = startup(restoredState);

      // Begin periodically persisting the store
      const persistor = persistStore(store, { storage: customStorage });
    }
  );
}
