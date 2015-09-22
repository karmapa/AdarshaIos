import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingTop: 14,
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
    height: 36,
    marginTop: 7,
    marginBottom: 7,
    marginRight: 5,
    padding: 10
  },
  button: {
    borderRadius: 4,
    paddingTop: 7,
    paddingLeft: 7,
    paddingRight: 7,
    paddingBottom: 7,
    marginBottom: 10
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
  buttonDefault: {
    borderWidth: 1,
    borderColor: '#cccccc'
  },
  buttonText: {
    textAlign: 'center'
  }
});


export const activeOpacity = 0.2;
