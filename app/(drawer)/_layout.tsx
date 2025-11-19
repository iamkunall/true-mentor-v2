import { MaterialIcons } from '@expo/vector-icons';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { apiWithAuth } from '@/components/ApiHelper';
import useAuthStore from '../store/Store';

// Menu items configuration - moved outside component to prevent recreation
const MENU_ITEMS = [
  { id: 'chat', label: 'Chat with IITian', route: '/(drawer)/chat' },
  { id: 'call', label: 'Talk with IITian', route: '/(drawer)/call' },
  { id: 'book', label: 'Book 30 Min Session', route: '/(drawer)/book' },
  { id: 'wallet', label: 'Wallet', route: '/(drawer)/wallet' },
  { id: 'orders', label: 'Order History', route: '/(drawer)/orders' },
  { id: 'history', label: 'Transactions', route: '/(drawer)/history' },
] as const;

// Memoized MenuItem component
const MenuItem = React.memo(
  ({ label, onPress }: { label: string; onPress: () => void }) => {
    return (
      <TouchableOpacity
        className="px-2 py-3 mb-2 flex-row items-center"
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text className="font-uber-medium text-[14px]">{label}</Text>
      </TouchableOpacity>
    );
  },
);

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();

  // Use a ref to store the navigation object to prevent re-renders
  const navigationRef = useRef(props.navigation);

  // Update the ref when navigation changes
  useEffect(() => {
    navigationRef.current = props.navigation;
  }, [props.navigation]);

  // Optimized Zustand selectors
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const fetchProfile = useCallback(async () => {
    if (!token) return;

    try {
      const { res } = await apiWithAuth('auth/profile', 'GET', {}, token);
      if (res?.profile) {
        if (res.profile.user) {
          setUser({
            ...res.profile.user,
            wallet: res.profile.wallet,
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  }, [token, setUser]);

  // Only run when token changes
  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token, fetchProfile]);

  const handleLogout = useCallback(async () => {
    clearAuth();
    router.replace('/(auth)/login');
  }, [clearAuth, router]);

  // Use the ref to access navigation
  const handleCloseDrawer = useCallback(() => {
    navigationRef.current.closeDrawer();
  }, []); // No dependencies needed since we use a ref

  // Memoize navigation handlers
  const navigationHandlers = useMemo(
    () =>
      MENU_ITEMS.reduce(
        (acc, item) => {
          acc[item.id] = () => router.push(item.route);
          return acc;
        },
        {} as Record<string, () => void>,
      ),
    [router],
  );

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, paddingTop: 0, marginTop: 0 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="px-2 py-6 border-b border-gray-200 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Text className="font-uber-bold text-black text-[16px]">
            <Text className="text-primary">True </Text>Mentor
          </Text>
        </View>
        <TouchableOpacity onPress={handleCloseDrawer} activeOpacity={0.7}>
          <MaterialIcons name="close" size={20} />
        </TouchableOpacity>
      </View>

      {/* Drawer Items */}
      <View className="mt-2">
        {MENU_ITEMS.map((item) => (
          <MenuItem
            key={item.id}
            label={item.label}
            onPress={navigationHandlers[item.id]}
          />
        ))}
      </View>

      {/* Logout */}
      <View className="mt-auto border-t border-gray-200 pt-4">
        <TouchableOpacity
          className="px-2 py-3 flex-row items-center"
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <MaterialIcons name="logout" size={20} color="#1A8CFF" />
          <Text className="font-uber-medium text-[14px] ml-2">Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

// Memoize the entire drawer content
const MemoizedDrawerContent = React.memo(CustomDrawerContent);

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <MemoizedDrawerContent {...props} />}
        screenOptions={{
          drawerStyle: {
            marginTop: 0,
            backgroundColor: '#fff',
            width: 280,
          },
          headerShown: false,
          // Performance optimizations
          swipeEnabled: true,
          swipeEdgeWidth: 50,
          lazy: true,
        }}
      >
        {/* Define your drawer screens here */}
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: 'Home',
            title: 'Home',
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: 'Profile',
            title: 'Profile',
          }}
        />
        {/* Add other screens as needed */}
      </Drawer>
    </GestureHandlerRootView>
  );
}
