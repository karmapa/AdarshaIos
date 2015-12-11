import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scriptureName: {
    backgroundColor: '#e7e7e7',
    paddingBottom: 7,
    paddingTop: 7,
    textAlign: 'center',
  },
  navbar: {
    backgroundColor: '#e7e7e7',
    paddingTop: 7,
    paddingBottom: 7,
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
    overflow: 'hidden',
    flex: 1,
    backgroundColor: '#ffffff'
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
    width: 40
  }
});
