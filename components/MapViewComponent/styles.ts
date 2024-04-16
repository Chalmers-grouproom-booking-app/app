// components/MapViewComponent/styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  button: {
    position: 'absolute',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    padding: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backToCampusButton: {
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },
  SearchBarButton: {
    top: 20,
    left: 20,
  },
  touchableArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    marginLeft: 5,
    color: '#fff',
  },
});