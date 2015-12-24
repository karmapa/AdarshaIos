
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
  },
  boxButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 4,
    paddingTop: 2
  },
  buttonImage: {
    height: 40,
    width: 40
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
});
