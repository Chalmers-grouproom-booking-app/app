import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      borderBottomWidth: 0
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 8,
    },
    searchBarContainer: {
      flex: 1,
      backgroundColor: 'white',
      borderWidth: 0,
      borderTopWidth: 0,
      borderBottomWidth: 0,
    },
    searchInputContainer: {
      backgroundColor: '#f2f2f2',
    },
    resultContainer: {
      flex: 1,
    },
    noResultsText: {
      color: 'gray',
      fontSize: 16,
      textAlign: 'center',
      marginTop: 10,
      padding: 20,
    },
    errorText: {
      color: 'red',
      fontSize: 16,
      textAlign: 'center',
      padding: 20,
    },
    resultText: {
      color: 'black',
      fontSize: 16,
    },
    resultTextExpanded: {
      fontWeight: 'bold',
      color: 'black',
      fontSize: 16,
      borderBottomWidth: 0
    },
    resultTextFirstComeFirstServed: {
      color: 'black',
      fontSize: 16,
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      paddingVertical: 10,
    },
    separatorFirstComeFirstServed: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'lightgray',
    },
    separatorText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    itemContainer: {
      paddingTop: 5,
    },
    roomDetails: {
      marginTop: 5,
      paddingHorizontal: 22,
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
      paddingBottom: 10,
    },
    detailText: {
      fontSize: 14,
      color: '#666',
    },
    reservationContainer: {
      marginTop: 10,
    },
    reservationTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
    },
    reservationItem: {
      marginBottom: 10,
    },
    reservationDate: {
      fontSize: 15,
      marginBottom: 5,
      color: '#007bff',
    },
    reservationText: {
      fontSize: 16,
      color: '#555',
      marginLeft: 10, // Indent the reservation times
    },
    reservationTime: {
      fontWeight: 'bold',
      color: '#ff4500', // red color for the time
    },
    noReservationText: {
      fontSize: 16,
      color: 'grey',
    },
    fcfText: {
      backgroundColor: '#f2f2f2',
      fontSize: 14,
      color: '#666',
      paddingHorizontal: 10,
      borderRadius: 10,
      paddingVertical: 5,
    },
    itemHeader: {
      width: '100%',
      flexDirection: 'row',
      paddingHorizontal: 22,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      justifyContent: 'space-between',
    },
    iteamHeaderExpanded: {
      width: '100%',
      flexDirection: 'row',
      paddingHorizontal: 22,
      paddingVertical: 10,
      borderBottomWidth: 0,
      borderBottomColor: '#ccc',
      justifyContent: 'space-between',
    },
    noResultsContainer : {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 50,
      maxWidth: '80%',
      alignSelf: 'center',
    },
    noResultText: {
      fontSize: 16,
      color: '#666',
    },
  });