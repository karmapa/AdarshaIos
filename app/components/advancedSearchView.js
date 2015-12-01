'use strict';

import React, { Component, PropTypes, Text, TextInput, View, PickerIOS,
  ScrollView, TouchableHighlight } from 'react-native';

import { styles } from './advancedSearchView.style';

const PickerItemIOS = PickerIOS.Item;
const fields = [
  {name: 'division', placeholder: 'སྡེ་ཚན།:'},
  {name: 'tname', placeholder: 'མདོ་མིང་།:'},
  {name: 'aname', placeholder: 'མདོ་མིང་གཞན།:'},
  {name: 'sname', placeholder: 'རྒྱ་གར་མདོ་མིང་།:'},
  {name: 'cname', placeholder: 'རྒྱ་ནག་མདོ་མིང་།:'},
  {name: 'sname', placeholder: 'བརྗོད་བྱ།:'},
  {name: 'yana', placeholder: 'ཐེག་པ།:'},
  {name: 'charka', placeholder: 'དཀའ། འཁོར་ལོ།:'},
  {name: 'location', placeholder: 'གནས་ཕུན་སུམ་ཚོགས་པ།:'},
  {name: 'purpose', placeholder: 'ཆོས་ཀྱི་དགོས་དོན།:'},
  {name: 'collect', placeholder: 'བསྡུས་པའི་དོན། ལེའུ།:'},
  {name: 'relation', placeholder: 'མཚམས་སྦྱར་བའི་གོ་རིམ།:'},
  {name: 'debate', placeholder: 'རྒལ་ལན།:'},
  {name: 'translator', placeholder: 'ལོ་ཙཱ་བ།:'},
  {name: 'reviser', placeholder: 'ཞུ་དག་པ།:'}
];

class AdvancedSearchView extends Component {

  static PropTypes = {
    db: PropTypes.object.isRequired
  };

  state = {
    division: '',
    tname: '',
    aname: '',
    sname: '',
    cname: '',
    subject: '',
    yana: '',
    charka: '',
    location: '',
    purpose: '',
    collect: '',
    relation: '',
    debate: '',
    translator: '',
    reviser: ''
  };

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <ScrollView style={styles.container}>
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
        <View style={styles.buttonGroups}>
          <TouchableHighlight underlayColor={'#16a085'} style={[styles.button, styles.buttonPrimary]}>
            <Text style={[styles.buttonPrimaryText, styles.buttonText]}>Search</Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'#ecf0f1'} style={[styles.button, styles.buttonDefault]}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  }
}

export default AdvancedSearchView;
