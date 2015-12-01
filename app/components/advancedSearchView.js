'use strict';

import React, { Component, PropTypes, Text, TextInput, View,
  ScrollView, TouchableHighlight } from 'react-native';

import { styles } from './advancedSearchView.style';

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

        <TextInput style={styles.input} placeholder="སྡེ་ཚན།:" />
        <TextInput style={styles.input} placeholder="མདོ་མིང་།:" />
        <TextInput style={styles.input} placeholder="མདོ་མིང་གཞན།:" />
        <TextInput style={styles.input} placeholder="རྒྱ་གར་མདོ་མིང་།:" />
        <TextInput style={styles.input} placeholder="རྒྱ་ནག་མདོ་མིང་།:" />
        <TextInput style={styles.input} placeholder="བརྗོད་བྱ།:" />


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
