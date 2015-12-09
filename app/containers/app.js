import * as reducers from '../reducers';
import MainApp from './mainApp';
import React, {Component} from 'react-native';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux/native';
import {createStore, applyMiddleware, combineReducers} from 'redux';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        {() => <MainApp />}
      </Provider>
    );
  }
}
