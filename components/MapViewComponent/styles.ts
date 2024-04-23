import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  button: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 6,
    opacity: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0.3,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  backToCampusButton: {
    paddingHorizontal: 12,
    bottom: 8, 
    right: 8,
  },
  SearchBarButton: {
    top: 8, 
    left: 8,
  },
  UserLocationButton: {
    bottom: 8, 
    left: 8,
  },
  touchableArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
    minHeight: 50,
  },
  buttonText: {
    marginLeft: 5,
    color: '#333', 
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    paddingHorizontal: 5,
  },
  infoContainer: {
    position: 'absolute',
    bottom: height * 0.1,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 16,
  },
});
