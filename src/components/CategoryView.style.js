import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  scriptureContainer: {
    backgroundColor: '#e7e7e7',
    paddingBottom: 7,
    paddingTop: 27
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
    paddingTop: 27,
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
    paddingLeft: 14,
    paddingTop: 10,
    paddingBottom: 10,
    flex: 1
  },
  rowIcon: {
    width: 16,
    height: 16,
    marginRight: 10
  },
  backButton: {
    width: 40
  }
});
