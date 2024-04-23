import { Button } from '@rneui/base';
import { StyleSheet } from 'react-native';

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
        backgroundColor: '#FFF',
        padding: 20,
        elevation: 5,
      },
      filterTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      input: {
        height: 40,
        marginVertical: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        borderColor: 'gray',
      },
      switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
      }    
});
  
  