
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: 'transparent'
  },
  nav: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    left: 0,
    paddingBottom: 7,
    paddingTop: 7,
    position: 'absolute',
    right: 0,
    top: 0
  },
  navButton: {
    width: 40
  },
  navTitle: {
    color: '#ffffff',
    flex: 1,
    textAlign: 'center'
  },
  textView: {
    paddingLeft: 14,
    paddingRight: 14
  }
});
