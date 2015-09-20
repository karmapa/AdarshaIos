'use strict';

import React, { Component, PropTypes, Text, TextInput, View, PickerIOS,
  ScrollView, TouchableHighlight } from 'react-native';

import { styles } from './advancedSearchView.style';

let PickerItemIOS = PickerIOS.Item;

class AdvancedSearchView extends Component {

  static PropTypes = {
    db: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <ScrollView>
        <TextInput style={styles.input} placeholder="經名:" value="" />
        <TextInput style={styles.input} placeholder="別名:" value="" />
        <TextInput style={styles.input} placeholder="梵文經名:" value="" />
        <TextInput style={styles.input} placeholder="中文經名:" value="" />
        <TextInput style={styles.input} placeholder="主題:" value="" />
        <PickerIOS>
          <PickerItemIOS key="1" value="初轉法輪" label="初轉法輪" />
          <PickerItemIOS key="2" value="初轉法輪2" label="初轉法輪2" />
        </PickerIOS>
        <PickerIOS>
          <PickerItemIOS key="2" value="說法處" label="說法處" />
        </PickerIOS>
        <TextInput style={styles.input} placeholder="閱法者:" value="" />
        <TextInput style={styles.input} placeholder="講法者:" value="" />
        <TextInput style={styles.input} placeholder="梵文注釋:" value="" />
        <TextInput style={styles.input} placeholder="藏文注釋:" value="" />
        <TextInput style={styles.input} placeholder="漢文注釋:" value="" />
        <PickerIOS>
          <PickerItemIOS key="2" value="譯者:" label="譯者" />
        </PickerIOS>
        <TextInput style={styles.input} placeholder="校對者:" value="" />
        <View>
          <TouchableHighlight>
            <Text>Cancel</Text>
          </TouchableHighlight>
          <TouchableHighlight>
            <Text>Search</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  }
}

export default AdvancedSearchView;
