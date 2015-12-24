import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scriptureContainer: {
    backgroundColor: '#e7e7e7',
    paddingBottom: 7,
    paddingTop: 7,
  },
  scriptureBody: {
    alignSelf: 'center',
    flexDirection: 'row',
    flex: 1
  },
  scriptureLogo: {
    width: 22,
    height: 22,
    marginRight: 7
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
