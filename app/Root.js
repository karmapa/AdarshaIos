'use strict';

import MainApp from './containers/mainApp';
import React, {Component} from 'react-native';
import reducer from './modules/reducer';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux/native';
import {createStore, applyMiddleware} from 'redux';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducer);

export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        {() => <MainApp />}
      </Provider>
    );
  }
}
