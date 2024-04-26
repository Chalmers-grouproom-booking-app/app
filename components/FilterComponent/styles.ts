import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); // Get the device width

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f4f4f4', // Set a neutral background color
      paddingVertical: 20,
    },
    pickerContainer: {
      backgroundColor: '#ffffff', // White background for picker sections
      padding: 10, // Add padding to give space around the pickers
      marginBottom: 10, // Space between different sections
      borderRadius: 10, // Rounded corners for modern design
      shadowOpacity: 0.1, // Slight shadow for elevation effect
      shadowRadius: 5, // Soft shadow
      shadowColor: '#000',
      shadowOffset: { height: 2, width: 0 },
      elevation: 3, // Elevation for Android
    },
    filterTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8, // More space between title and picker
      color: '#333', // Dark color for better readability
    },
    picker: {
      height: 44,
      width: '100%', // Ensure it takes the full width of its container
    },
    sliderContainer: {
      backgroundColor: '#ffffff',
      padding: 10,
      marginBottom: 10,
      borderRadius: 10,
      shadowOpacity: 0.1,
      shadowRadius: 5,
      shadowColor: '#000',
      shadowOffset: { height: 2, width: 0 },
      elevation: 3,
    },
    checkBoxContainer: {
      backgroundColor: '#ffffff',
      padding: 10,
      borderRadius: 10,
      shadowOpacity: 0.1,
      shadowRadius: 5,
      shadowColor: '#000',
      shadowOffset: { height: 2, width: 0 },
      elevation: 3,
    },
    checkBoxOptionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5, // Adds spacing between each checkbox option
    },
    checkBoxOption: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10, // More padding for touchability
    },
});

export default styles;
