import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../styles/styles';
import { Stack } from 'expo-router/stack';
import Toast from 'react-native-toast-message';
import 'react-native-reanimated';
export default function AppLayout() {
  return (
    <SafeAreaView style={globalStyles.container}>
      <Stack 
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      />
      <Toast />
    </SafeAreaView>
  );
}
