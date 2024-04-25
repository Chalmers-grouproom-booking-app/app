import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  button: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 6,
    opacity: 0.9,
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
    position: 'absolute',
    opacity: 0.9,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 50,
    bottom: 12, 
    right: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0.3,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10
  },
  optionButton: {
    opacity: 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 200,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    marginVertical: 8,     
  },
  optionText: {
      color: '#333', 
      fontSize: 20,
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      paddingHorizontal: 4,
  },
  backToLindholmenButton: {
    paddingHorizontal: 12,
    bottom: 65, 
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
  buttonJohannebergText: {
    marginLeft: 5,
    color: '#333', 
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    paddingHorizontal: 5,
  },
  buttonLindholmenText: {
    marginLeft: -4,
    color: '#333', 
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    paddingHorizontal: 14,
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
  calloutStyle: {
        width: 160, // Adjust the width of the Callout
        padding: 10,
    },
    calloutView: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    calloutDescription: {
        fontSize: 12,
    }
});
