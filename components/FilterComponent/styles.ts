import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); // Use the device width for sizing

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fafafa', // Soft grey background for the entire view
      paddingVertical: 20, // Vertical padding for the container
      paddingHorizontal: 10, // Horizontal padding for overall content alignment
    },
    pickerContainer: {
      backgroundColor: '#ffffff', // White background for input sections
      padding: 12, // Uniform padding for a spacious feel
      marginBottom: 16, // Space between different sections
      borderBottomWidth: 1, // Subtle bottom border for a light separation
      borderBottomColor: '#e0e0e0', // Soft grey for the border
    },
    filterTitle: {
      fontSize: 18,
      fontWeight: 'bold', // Bold for title clarity
      marginBottom: 10, // Space below the title
      color: '#2c3e50', // A darker, richer color for text
    },
    picker: {
      height: 44,
      width: '100%', // Full width for the picker
    },
    sliderContainer: {
      backgroundColor: '#ffffff',
      padding: 12,
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    checkBoxContainer: {
      backgroundColor: '#ffffff',
      padding: 12,
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    checkBoxOptionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10, // Spacing for clarity and accessibility
    },
    checkBoxOption: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12, // Ample padding for easy interaction
    },
});

export default styles;
