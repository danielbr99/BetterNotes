import 'react-native-gesture-handler';
import { Stack, useRouter, useSegments } from "expo-router";
import { View } from "react-native";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Storage } from "../src/services/storage";
import { setApiBaseUrl } from "../src/services/api";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from "expo-router/drawer";
import { TamaguiProvider } from 'tamagui';
import config from '../src/theme/tamagui.config';
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config as gluestackConfig } from "@gluestack-ui/config";

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    Storage.getServerUrl().then((url) => {
      if (url) setApiBaseUrl(url);
    });
  }, []);

  if (isAuthenticated === null) {
    return null; // Don't render until we know the auth state
  }

  if (!isAuthenticated) {
    if (segments[0] !== "auth") {
      import('expo-router').then(m => m.router.replace('/auth/login'));
      return <View style={{ flex: 1, backgroundColor: '#F2F2F7' }} />;
    }
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
      </Stack>
    );
  }

  if (isAuthenticated && segments[0] === "auth") {
    import('expo-router').then(m => m.router.replace('/'));
    return <View style={{ flex: 1, backgroundColor: '#F2F2F7' }} />;
  }

  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: "#F2F2F7",
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTintColor: "#D4A017",
        drawerActiveTintColor: "#D4A017",
        drawerInactiveTintColor: "#8E8E93",
      }}
    >
      <Drawer.Screen 
        name="index" 
        options={{ 
          drawerLabel: "Todas las Notas",
          title: "Mis Notas" 
        }} 
      />
      <Drawer.Screen 
        name="folders" 
        options={{ 
          drawerLabel: "Carpetas",
          title: "Mis Carpetas" 
        }} 
      />
      <Drawer.Screen 
        name="kanban" 
        options={{ 
          drawerLabel: "Tablero Kanban",
          title: "Tablero Kanban" 
        }} 
      />
      <Drawer.Screen 
        name="trash" 
        options={{ 
          drawerLabel: "Papelera",
          title: "Papelera" 
        }} 
      />
      <Drawer.Screen 
        name="settings" 
        options={{ 
          drawerLabel: "Ajustes",
          title: "Configuración" 
        }} 
      />
      <Drawer.Screen
        name="entry/[id]"
        options={{
          drawerItemStyle: { display: 'none' },
          title: "Detalles",
        }}
      />
      <Drawer.Screen
        name="folder/[id]"
        options={{
          drawerItemStyle: { display: 'none' },
          title: "Carpeta",
        }}
      />
    </Drawer>
  );
}

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={config} defaultTheme="light">
        <GluestackUIProvider config={gluestackConfig}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <RootLayoutNav />
            </AuthProvider>
          </QueryClientProvider>
        </GluestackUIProvider>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}
