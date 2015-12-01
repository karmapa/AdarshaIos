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
  {name: 'subject', placeholder: 'བརྗོད་བྱ།:'},
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
    db: PropTypes.object.isRequired,
    division: PropTypes.string.isRequired,
    tname: PropTypes.string.isRequired,
    aname: PropTypes.string.isRequired,
    sname: PropTypes.string.isRequired,
    cname: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    yana: PropTypes.string.isRequired,
    charka: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    purpose: PropTypes.string.isRequired,
    collect: PropTypes.string.isRequired,
    relation: PropTypes.string.isRequired,
    debate: PropTypes.string.isRequired,
    translator: PropTypes.string.isRequired,
    reviser: PropTypes.string.isRequired,
    setFieldsData: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  onInputChange = (name, value) => {
    this.props.setFieldsData({[name]: value});
  }

  render() {

    return (
      <ScrollView style={styles.container}>

        {fields.map(row => <TextInput key={row.name} style={styles.input}
          placeholder={row.placeholder} onChangeText={this.onInputChange.bind(this, row.name)} value={this.props[row.name]} />)}

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
