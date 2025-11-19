// app/_layout.tsx or app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';

export default function TabLayout() {
  console.log('This is tabs layout file');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1A8CFF', // your brand primary color
        tabBarInactiveTintColor: '#9CA3AF', // gray-400
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: 'white',
            borderTopWidth: 0,
            height: 80,
            // Remove paddingHorizontal to allow full width
            justifyContent: 'center',
          },
          android: {
            backgroundColor: 'white',
            borderTopWidth: 0,
            elevation: 5,
            height: 60,
            // Remove paddingHorizontal to allow full width
            // Add pointerEvents to ensure touch events are handled
            pointerEvents: 'auto',
          },
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 0,
        },
        // Remove fixed width and use flex for equal distribution
        tabBarItemStyle: {
          flex: 1,
          // Ensure touchable area is large enough
          paddingVertical: 5,
        },
        // Add this to fix Android multiple tap issue
        // tabBarPressColor: 'transparent',
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('@/assets/images/navigation/cottage-active.png')
                  : require('@/assets/images/navigation/cottage.png')
              }
              style={{ width: 24, height: 24 }}
            />
          ),
          // Remove individual tabBarBackground since we have it in screenOptions
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('@/assets/images/navigation/chat-active.png')
                  : require('@/assets/images/navigation/chat.png')
              }
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="goals"
        options={{
          title: 'Track Goals',
          tabBarIcon: ({ color }) => <FontAwesome5 name="bullseye" size={24} color={color} />,
        }}
      /> */}
      <Tabs.Screen
        name="call"
        options={{
          title: 'Call',
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('@/assets/images/navigation/call-active.png')
                  : require('@/assets/images/navigation/call.png')
              }
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: 'Book',
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('@/assets/images/navigation/clock-active.png')
                  : require('@/assets/images/navigation/clock.png')
              }
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
