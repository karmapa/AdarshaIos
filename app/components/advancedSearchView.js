'use strict';

import React, { Component, PropTypes, Text, TextInput, View, Modal,
  ScrollView, TouchableHighlight, PickerIOS } from 'react-native';

import { styles } from './advancedSearchView.style';

import _ from 'lodash';

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
let divisionNames = biography.divisions.map(division => division.divisionName);

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

  getFilledInputs = () => {
    let self = this;
    return fields.filter((row) => {
      return (self.props.advanceSearchSettings[row.name] || '').length > 0;
    })
    .map((row) => {
      return {
        name: row.name,
        value: self.props.advanceSearchSettings[row.name]
      };
    });
  }

  findSutraIds = (division, filledInputs) => {
    let all = (0 === division);
    let divisionIndices = all ? divisionNames.map((name, index) => index) : [(division - 1)];

    return _.chain(divisionIndices)
      .map((divisionIndex) => {
        return biography.divisions[divisionIndex].sutras;
      })
      .flatten()
      .filter(matchInputs)
      .pluck('sutraid')
      .value();

    function matchInputs(sutra) {
      return _.some(filledInputs, (row) => {
        let value = sutra[row.name] || '';
        return (value.length > 0) && (-1 !== value.indexOf(row.value));
      });
    }
  }

  search = () => {

    let filledInputs = this.getFilledInputs();

    if (0 === filledInputs.length) {
      this.alert('Please fill-out at least one input field before searching.');
      return;
    }

    let sutraIds = this.findSutraIds(this.props.advanceSearchSettings.division, filledInputs);
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
          {divisionNames.map((name, index) => <PickerItemIOS key={index + 1} value={index + 1} label={name} />)}
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
