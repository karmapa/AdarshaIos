import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  navbar: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 10,
    paddingBottom: 10,
    position: 'relative',
    flexDirection: 'row'
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
  title: {
    flex: 1,
    left: 0,
    right: 0,
    marginRight: 30,
    textAlign: 'center'
  },
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#ffffff'
  },
  rowContainer: {
    marginBottom: 7,
    marginTop: 7
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  rowText: {
    height: 32,
    paddingLeft: 14
  },
  backButton: {
    width: 30
  }
});
