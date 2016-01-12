import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  backgroundImageContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  cover: {
    flex: 1,
    height: null,
    width: null
  },
  transparentContainer: {
    backgroundColor: 'transparent',
    flex: 1
  },
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    paddingTop: 20
  },
  viewSpinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  navIcon: {
    alignSelf: 'center',
    height: 22,
    width: 22
  },
  spinner: {
    backgroundColor: 'transparent',
    height: 24,
    width: 24
  }
});

export const values = {
  navIconSize: 22,
  navIconColor: '#555555',
  underlayColor: '#ecf0f1',
  highlightColors: [
    {color: '#ff0000'},    // red
    {color: '#d35400'},    // pumpkin
    {color: '#27ae60'},    // nephritis
    {color: '#16a085'},    // green sea
    {color: '#2980b9'},    // belize hole
    {color: '##8e44ad'}    // wisteria
  ]
};
