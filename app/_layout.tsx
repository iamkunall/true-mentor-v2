import '../global.css';

import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import useAuthStore from './store/Store';

import 'react-native-reanimated';

export default function RootLayout() {
  const token = useAuthStore((state) => state.token);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'UberMove-Light': require('../assets/fonts/UberMoveTextLight.ttf'),
    UberMove: require('../assets/fonts/UberMoveTextRegular.ttf'),
    'UberMove-Medium': require('../assets/fonts/UberMoveTextMedium.ttf'),
    'UberMove-Bold': require('../assets/fonts/UberMoveTextBold.ttf'),
    Nunito: require('../assets/fonts/NunitoSans-Regular.ttf'),
    'Nunito-Light': require('../assets/fonts/NunitoSans-Light.ttf'),
    'Nunito-Medium': require('../assets/fonts/NunitoSans-SemiBold.ttf'),
    'Nunito-Bold': require('../assets/fonts/NunitoSans-Bold.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <SafeAreaView className="flex-1 bg-white">
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Protected guard={!token}>
            <Stack.Screen name="(auth)" />{' '}
          </Stack.Protected>
          <Stack.Protected guard={!!token}>
            <Stack.Screen name="(drawer)" />
          </Stack.Protected>
        </Stack>
      </SafeAreaView>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
