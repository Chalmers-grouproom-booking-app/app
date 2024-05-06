import { StyleSheet } from 'react-native';
import { screenWidth } from '../../constants';


export const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
    },  
    backdrop: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    panel: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      width: screenWidth * 0.8,
      backgroundColor: '#FFF',
      paddingTop: 20,
      paddingRight: 20,
      paddingBottom: 20,
      paddingLeft: 0,  // Reduced padding on the left
      elevation: 5,
    },
    filterTitle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    pickerContainer: {
      marginBottom: 5,
      marginLeft: '5%', // Explicitly set to 0
    },
    picker: {
      height: 50,
      width: '80%',
      marginBottom: 5,
      marginLeft: 0, // Explicitly set to 0
    },
    placeholder: {
      color: 'gray',
      fontSize: 16,
    },
    pickerItemStyling: {
      fontSize: 12,
      color: 'black',
    },
    sliderContainer: {
      height: 50,
      width: '70%',
      marginBottom: '15%',
      marginLeft: '5%', // Explicitly set to 0
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '80%',
      justifyContent: 'space-between',
      paddingVertical: 0,
      marginLeft: '5%', // Explicitly set to 0
    },
    checkBoxContainer: {
      flexDirection: 'column',
      marginLeft: '5%', // Explicitly set to 0
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
    }, checkBoxColumn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    }
});