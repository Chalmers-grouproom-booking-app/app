import { Slot } from 'expo-router/build/exports';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../styles/styles';
import { Stack } from 'expo-router/stack';

export default function AppLayout() {
  return (
    <SafeAreaView style={globalStyles.container}>
      <Stack 
        screenOptions={{
          headerShown: false
        }}
      />
    </SafeAreaView>
  );
}
