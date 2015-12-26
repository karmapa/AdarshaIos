import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    backgroundColor: 'transparent',
    flex: 1
  },
  heading: {
    borderBottomColor: 'rgba(0, 0, 0, 0.4)',
    borderBottomWidth: 1,
    paddingBottom: 7,
    paddingTop: 7
  },
  headingText: {
    fontSize: 18
  },
  content: {
    paddingTop: 10,
    paddingBottom: 7,
    marginBottom: 14
  },
  scrollView: {
    paddingLeft: 14,
    paddingRight: 14,
    paddingBottom: 14
  },
  navTitle: {
    color: '#ffffff',
    flex: 1,
    textAlign: 'center'
  },
  navButton: {
    width: 40
  },
  nav: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomColor: 'rgba(0, 0, 0, 0.4)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    left: 0,
    paddingBottom: 7,
    paddingTop: 7,
    position: 'absolute',
    right: 0,
    top: 20
  }
});
