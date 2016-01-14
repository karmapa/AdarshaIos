import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: 'transparent'
  },
  nav: {
    backgroundColor: 'rgba(27, 140, 144, 0.5)',
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
  bottomButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    flex: 1
  },
  upButton: {
    backgroundColor: 'rgba(27, 140, 144, 0.5)',
    position: 'absolute',
    justifyContent: 'center',
    right: 7,
    width: 40,
    height: 40
  },
  navTitle: {
    paddingRight: 16,
    color: '#ffffff',
    flex: 1,
    textAlign: 'center'
  },
  textView: {
    paddingLeft: 14,
    paddingRight: 14
  },
  bottomBar: {
    backgroundColor: 'rgba(27, 140, 144, 0.5)',
    padding: 10,
    position: 'absolute',
    left: 0,
    right: 0
  },
  rows: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#cccccc',
    borderRadius: 4,
    borderWidth: 1,
    color: '#555555',
    flex: 2,
    fontSize: 18,
    height: 50,
    padding: 7
  },
});
