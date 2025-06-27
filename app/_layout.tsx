// Arquivo: app/_layout.tsx
import { Slot, usePathname } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import Voltar from '@/components/Voltar';

export default function Layout() {
  const pathname = usePathname();

  const isInitialScreen =
    pathname === '/' ||
    pathname === '/index' ||
    pathname === '/auth/login' ||
    pathname === '/auth/register' ||
    pathname === '/dashboard-funcionario' ||
    pathname === '/dashboard-admin';

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {!isInitialScreen && (
          <View style={styles.header}>
            <Voltar />
          </View>
        )}
        <Slot />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E45',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: '#2C3E45',
  },
});
