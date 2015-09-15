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

var {AppRegistry, StyleSheet, Text, TextInput, TouchableHighlight, View} = React;

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
    padding: 30,
    marginTop: 5,
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    margin: 5,
    backgroundColor:'#FFFFFF',
    color: '#656565'
  },
  searchInput: {
    height: 36,
    padding: 10,
    marginRight: 5,
    flex: 3,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#a4a4a4',
    borderRadius: 6,
    color: '#656565'
  },
  button: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#bb5146',
    borderColor: '#bb5146',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 2,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  }
});

AppRegistry.registerComponent('AdarshaIos', () => AdarshaIos);
