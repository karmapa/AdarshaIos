/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var kfs = require('NativeModules').KsanaFileSystem;

global.kfs = kfs;

if (! kfs) {
  throw 'Ksana file system not found. Have you imported ksana-react-native in xcode ?';
}

var React = require('react-native');
var kde = require('ksana-database');
var kse = require('ksana-search');

var SearchResult = require('./search-result');

var {AppRegistry, StyleSheet, Text, TextInput, View} = React;

var AdarshaIos = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('AdarshaIos', () => AdarshaIos);
