import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="otp-verify" />
      <Stack.Screen name="basic-identity" />
      <Stack.Screen name="academic-background" />
    </Stack>
  );
}
