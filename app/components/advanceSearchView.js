'use strict';

import React, {Component, Dimensions, PropTypes, Text, TextInput, View, Modal,
  ScrollView, TouchableHighlight, PickerIOS} from 'react-native';
import _ from 'lodash';
import ksa from 'ksana-simple-api';
import {DB_NAME} from '../constants/AppConstants';
import {Spinner} from 'react-native-icons';
import {KeyboardSpacer} from '.';
import {connect} from 'react-redux/native';
import {fetch} from '../helpers';
import {setFieldsData} from '../modules/advanceSearch';
import {styles} from './advanceSearchView.style';

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

const biography = require('../../biography.json');
const divisionNames = biography.divisions.map(division => division.divisionName);

@connect(state => ({
  advanceSearchSettings: state.advanceSearch.toObject(),
  sutraMap: state.main.get('sutraMap')
}), {setFieldsData})
class AdvanceSearchView extends Component {

  static PropTypes = {
    sutraMap: PropTypes.object.isRequired,
    advanceSearchSettings: PropTypes.object.isRequired,
    setFieldsData: PropTypes.func.isRequired,
    navigator: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      modalMessage: '',
      loading: false
    };
  }

  onInputChange = (name, value) => {
    this.props.setFieldsData({[name]: value});
  };

  alert = message => {
    // workaround: make sure modal view exists
    this.setLoading(false);

    this.setState({
      modalMessage: message,
      modalVisible: true
    });
  };

  closeAlert = () => {
    this.setState({
      modalVisible: false
    });
  };

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
  };

  findSutraRows = (division, filledInputs) => {
    let all = (0 === division);
    let divisionIndices = all ? divisionNames.map((name, index) => index) : [(division - 1)];

    return _.chain(divisionIndices)
      .map((divisionIndex) => {
        return biography.divisions[divisionIndex].sutras;
      })
      .flatten()
      .filter(matchInputs)
      .map(row => _.pick(row, ['sutraid', 'tname']))
      .value();

    function matchInputs(sutra) {
      return _.every(filledInputs, row => {
        let value = sutra[row.name] || '';
        return (value.length > 0) && (-1 !== value.indexOf(row.value));
      });
    }
  };

  attachVpos = sutraRows => {
    return sutraRows.map(sutraRow => Object.assign(sutraRow, {
      vpos: _.get(this.props.sutraMap[sutraRow.sutraid], 'vpos')
    }));
  };

  setLoading = loading => this.setState({loading});

  search = async () => {

   let filledInputs = this.getFilledInputs();

    if (0 === filledInputs.length) {
      this.alert('Please fill-out at least one input field before searching.');
      return;
    }

    this.setLoading(true);

    let sutraRows = this.findSutraRows(this.props.advanceSearchSettings.division, filledInputs);

    sutraRows = this.attachVpos(sutraRows)
      .filter(sutraRow => undefined !== sutraRow.vpos)
      .filter((sutraId, index) => index < 50);

    let poss = _.pluck(sutraRows, 'vpos');

    if (_.isEmpty(poss)) {
      this.alert('Did not find any sutras.');
      return;
    }

    let rows = await fetch({vpos: poss});

    if (_.isEmpty(rows)) {
      this.alert('Did not find any sutras.');
      return;
    }

    // attach tname
    rows = rows.map((row, index) => Object.assign(row, {
      t: sutraRows[index].tname
    }));

    this.props.navigator.push({
      name: 'AdvanceSearchView',
      title: 'Advance Search',
      tocRows: rows
    });

    this.setLoading(false);
  };

  reset = () => {
    this.props.setFieldsData({
      division: 0,
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
    });
  };

  onDivisionChange = newValue => {
    this.props.setFieldsData({division: newValue});
  };

  handleSubmit = () => {
    this.search();
  };

  render() {

    if (this.state.loading) {

      let spinnerProps = {
        name: 'ion|load-c',
        size: 24,
        color: '#777',
        style: styles.stylesSpinner
      };

      return (
        <View style={styles.viewSpinner}>
          <Spinner {...spinnerProps} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>

          <PickerIOS selectedValue={this.props.advanceSearchSettings.division} onValueChange={this.onDivisionChange}>
            <PickerItemIOS key={0} value={0} label={'All'} />
            {divisionNames.map((name, index) => <PickerItemIOS key={index + 1} value={index + 1} label={name} />)}
          </PickerIOS>

          {fields.map(row => <TextInput key={row.name} style={styles.input} autoCapitalize="none" returnKeyType="search"
            placeholder={row.placeholder} onChangeText={this.onInputChange.bind(this, row.name)}
            onSubmitEditing={this.handleSubmit} value={this.props.advanceSearchSettings[row.name]} />)}

          <View>
            <Modal transparent={true} animated={false} visible={this.state.modalVisible}>
              <View style={styles.alertContainer}>
                <View style={styles.alertContent}>
                  <Text style={styles.alertText}>{this.state.modalMessage}</Text>
                  <TouchableHighlight underlayColor={'#19bd9b'} style={styles.alertButton} onPress={this.closeAlert}>
                    <Text style={styles.alertButtonText}>OK</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
          </View>

          <View style={styles.buttonGroups}>
            <TouchableHighlight underlayColor={'#ecf0f1'} style={styles.resetButton} onPress={this.reset}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
        <KeyboardSpacer />
      </View>
    );
  }
}

export default AdvanceSearchView;
