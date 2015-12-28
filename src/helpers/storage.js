import React, {AsyncStorage} from 'react-native';

const APP_KEY = '@Adarsha';

export default class Storage {

  static getKey = key => APP_KEY + ':' + key;

  static set = (key, value) => AsyncStorage.setItem(Storage.getKey(key), JSON.stringify(value));

  static get = key => AsyncStorage.getItem(Storage.getKey(key))
    .then(value => JSON.parse(value));
}
