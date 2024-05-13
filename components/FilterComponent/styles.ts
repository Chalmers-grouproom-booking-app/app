import { StyleSheet } from 'react-native';
import { screenWidth } from '../../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: screenWidth * 0.8,
    backgroundColor: '#FFF',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  pickerContainer: {
    marginHorizontal: '5%',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '90%',
  },
  placeholder: {
    color: 'gray',
    fontSize: 16,
  },
  pickerItemStyling: {
    fontSize: 16,
    color: 'black',
  },
  sliderContainer: {
    width: '90%',
    marginBottom: 20,
    marginHorizontal: '5%',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginHorizontal: '5%',
  },
  checkBoxContainer: {
    flexDirection: 'column',
    marginHorizontal: '5%',
    marginBottom: 0,
  },
  checkBoxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  checkBoxOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    backgroundColor: 'transparent', // Default background
  },
  resetButtonContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  }
});

