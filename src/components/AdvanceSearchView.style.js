import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  pickerIos: {
    width: 320
  },
  viewSpinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  stylesSpinner: {
    width: 24,
    height: 24,
    backgroundColor: 'transparent'
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    paddingLeft: 14,
    paddingRight: 14,
    paddingBottom: 14
  },
  input: {
    borderColor: '#cccccc',
    borderRadius: 4,
    borderWidth: 1,
    color: '#555555',
    flex: 1,
    fontSize: 18,
    height: 50,
    marginTop: 7,
    marginBottom: 7,
    marginRight: 5,
    padding: 7
  },
  buttonPrimary: {
    backgroundColor: '#19bd9b'
  },
  buttonPrimaryText: {
    color: '#ffffff'
  },
  buttonGroups: {
    marginTop: 21
  },
  alertButton: {
    width: 100,
    backgroundColor: '#19bd9b',
    borderColor: '#cccccc',
    borderRadius: 4,
    borderWidth: 1,
    padding: 7,
    marginTop: 14,
  },
  alertButtonText: {
    alignSelf: 'center',
    color: '#fff'
  },
  alertContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  alertContent: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 4,
    padding: 10
  },
  alertText: {
    marginTop: 7
  },
  buttonText: {
    textAlign: 'center'
  },
  resetButton: {
    borderColor: '#cccccc',
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 10,
    marginRight: 4,
    paddingBottom: 14,
    paddingLeft: 7,
    paddingRight: 7,
    paddingTop: 14
  }
});


export const activeOpacity = 0.2;
