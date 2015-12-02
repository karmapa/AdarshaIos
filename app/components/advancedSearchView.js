'use strict';

import React, { Component, PropTypes, Text, TextInput, View, Modal,
  ScrollView, TouchableHighlight, PickerIOS } from 'react-native';

import { styles } from './advancedSearchView.style';

const PickerItemIOS = PickerIOS.Item;
const fields = [
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

let biography = require('../../biography.json');
let divisionItems = biography.divisions.map(division => division.divisionName);

class AdvancedSearchView extends Component {

  static PropTypes = {
    db: PropTypes.object.isRequired,
    sutraMap: PropTypes.object.isRequired,
    advanceSearchSettings: PropTypes.object.isRequired,
    setFieldsData: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  state = {
    modalVisible: false,
    modalMessage: ''
  };

  onInputChange = (name, value) => {
    this.props.setFieldsData({[name]: value});
  }

  alert = (message) => {
    this.setState({
      modalMessage: message,
      modalVisible: true
    });
  }

  closeAlert = () => {
    this.setState({
      modalVisible: false
    });
  }

  getFilledInputCount = () => {
    let self = this;

    return fields.filter((row) => {
      return (self.props.advanceSearchSettings[row.name] || '').length > 0;
    }).length;
  }

  search = () => {

    if (0 === this.getFilledInputCount()) {
      this.alert('Please fill-out at least one input field before searching.');
      return;
    }

  }

  cancel = () => {
  }

  onDivisionChange = (newValue) => {
    this.props.setFieldsData({division: newValue});
  }

  render() {

    return (
      <ScrollView style={styles.container}>

        <PickerIOS selectedValue={this.props.advanceSearchSettings.division} onValueChange={this.onDivisionChange}>
          <PickerItemIOS key={0} value={0} label={'All'} />
          {divisionItems.map((name, index) => <PickerItemIOS key={index + 1} value={index + 1} label={name} />)}
        </PickerIOS>

        {fields.map(row => <TextInput key={row.name} style={styles.input}
          placeholder={row.placeholder} onChangeText={this.onInputChange.bind(this, row.name)} value={this.props.advanceSearchSettings[row.name]} />)}

        <View>
          <Modal transparent={true} animated={false} visible={this.state.modalVisible}>
            <View style={{backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, justifyContent: 'center', padding: 20}}>
              <View style={{borderRadius: 10, alignItems: 'center', backgroundColor: '#ffffff', padding: 10}}>
                <Text>{this.state.modalMessage}</Text>
                <TouchableHighlight underlayColor={'#16a085'} style={[styles.button, {backgroundColor: '#2196f3', marginTop: 7, marginBottom: 0}]} onPress={this.closeAlert}>
                  <Text style={{color: '#fff'}}>OK</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        </View>

        <View style={styles.buttonGroups}>
          <TouchableHighlight underlayColor={'#16a085'} style={[styles.button, styles.buttonPrimary]} onPress={this.search}>
            <Text style={[styles.buttonPrimaryText, styles.buttonText]}>Search</Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'#ecf0f1'} style={[styles.button, styles.buttonDefault]} onPress={this.cancel}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  }
}

export default AdvancedSearchView;
