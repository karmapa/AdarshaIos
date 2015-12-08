import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  navbar: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between'
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
    marginRight: 10
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
    flex: 1
  }
});
