import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import { createHashHistory as createHistory, History } from 'history';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { PersistConfig, persistReducer, persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage/session'; // session storage
import createSagaMiddleware from 'redux-saga';

import rootReducer from './reducers';
import rootSaga from './sagas';

import Application from './containers/Application';

const persistConfig: PersistConfig = {
  key: 'html',
  storage: storage,
  whitelist: [],
};

const middleWares = [];
const logger = createLogger();
const sagaMiddleware = createSagaMiddleware();
const history: History = createHistory();
middleWares.push(routerMiddleware(history));
middleWares.push(sagaMiddleware);
middleWares.push(logger);

const combinedReducers = rootReducer(history);
const reducers = persistReducer(persistConfig, combinedReducers);
const store = createStore(reducers, applyMiddleware(...middleWares));
const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={history}>
        <Application />
      </ConnectedRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
