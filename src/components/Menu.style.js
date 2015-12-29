
import {StyleSheet} from 'react-native';
import Dimensions from 'Dimensions';

const window = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    height: window.height,
    width: window.width,
    backgroundColor: '#333333',
    paddingLeft: window.width * 0.33
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  menu: {
    paddingTop: 20
  },
  item: {
    borderBottomColor: '#929292',
    borderBottomWidth: 1,
    flex: 1
  },
  wylie: {
    flex: 1,
    justifyContent: 'center'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 7,
    paddingBottom: 7,
    paddingRight: 10,
    paddingLeft: 10
  },
  backgroundButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  selected: {
    borderColor: 'rgba(0, 0, 0, 0.4)'
  },
  boxBackgrounds: {
    padding: 10
  },
  backgroundButtonImage: {
    height: 40,
    width: 40,
    borderWidth: 7,
    borderColor: '#333333'
  },
  buttonImage: {
    height: 40,
    width: 40
  },
  value: {
    fontSize: 18,
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center'
  }
});
